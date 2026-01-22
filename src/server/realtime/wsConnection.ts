// src/server/realtime/wsConnection.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from 'crypto';
import type { RedisClientType } from 'redis';
import type WebSocket from 'ws';
import { markConnected, markDisconnected, getConnectedUserIds } from './presence';
import { onUserConnected, onUserDisconnected } from './hostGrace';
import { zChat, zJoinGame, zJoinTopic, zPing } from '.';
import { zRoom } from '@/schemas/api/rooms';
import { createRoomActor } from '@/server/roomService';
import { connectMongoose } from '../../db/connectMongoose';
import { getRedis } from '../../redis';
import { getRoomIdFromTopic, streamKeyForTopic, timestampFromStreamId } from './topicStreams';
import { $keys } from '../../keys';
import { listWhisperTopicsForUser } from '../../serverFns/listWhisperTopicsForUser';
import { GameRoles, ChatMsg } from '../../types/game';
import { maybeRemindPickStoryteller } from './reminder';
import $gameMember from '../../serverFns/gameMember';
import $game from '../../serverFns/game';
import { parseCookie } from '../parseCookie';
import { cookieName } from '../auth/cookies';
import $session from '../../serverFns/session';
import { shouldAllowWhisper } from './whisperGate';
import { sendGameEvent } from '@/server/gameService';
import { MatchModel } from '@/db/models/Match';
import type { GameEvents } from '@/machines/GameMachine';

type Conn = {
    ws: WebSocket;
    userId: string;
    name: string;
    gameId?: string;
    role?: GameRoles;
    matchId?: string;
    subscriber?: RedisClientType;
    topics: Set<string>;
};

function send(ws: WebSocket, obj: any) {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(obj));
}

function parsePubsubMessage(raw: string) {
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
}

async function ensureMatchId(conn: Conn) {
    if (conn.matchId) return conn.matchId;
    if (!conn.gameId) return undefined;
    const match = await MatchModel.findOne({ roomId: conn.gameId, status: 'in_progress' }).lean();
    if (!match) return undefined;
    conn.matchId = match._id;
    return match._id;
}

async function publishPresenceUpdate(
    gameId: string,
    userId: string,
    status: 'connected' | 'disconnected',
    publish?: (topic: string, msg: any) => Promise<void>
) {
    if (!publish) return;
    const connectedUserIds = await getConnectedUserIds(gameId);
    const payload = {
        kind: 'event',
        type: 'presenceChanged',
        ts: Date.now(),
        payload: {
            gameId,
            userId,
            status,
            connectedUserIds
        }
    };
    await Promise.all([publish($keys.publicTopic(gameId), payload), publish($keys.stTopic(gameId), payload)]);
}

async function subscribeToTopic(conn: Conn, topic: string) {
    if (!conn.subscriber) throw new Error('no subscriber');
    await conn.subscriber.subscribe(topic, (message, channel) => {
        const payload = parsePubsubMessage(message);
        send(conn.ws, {
            t: 'topicMessage',
            topic: channel ?? topic,
            payload
        });
    });
}

async function canJoinTopic(conn: Conn, topicId: string) {
    if (!conn.gameId) return false;
    const legacyPrefix = `game:${conn.gameId}:`;
    const roomPrefix = `room:${conn.gameId}:`;
    const isLegacyTopic = topicId.startsWith(legacyPrefix);
    const isRoomTopic = topicId.startsWith(roomPrefix);
    if (!isLegacyTopic && !isRoomTopic) return false;

    const publicTopics = new Set([$keys.publicTopic(conn.gameId), $keys.roomPublicTopic(conn.gameId)]);
    const stTopics = new Set([$keys.stTopic(conn.gameId), $keys.roomStTopic(conn.gameId)]);
    if (publicTopics.has(topicId)) return true;
    if (stTopics.has(topicId)) return conn.role === 'storyteller';

    const whisperPrefix = `${legacyPrefix}whisper:`;
    const roomWhisperPrefix = `${roomPrefix}whisper:`;
    if (topicId.startsWith(whisperPrefix) || topicId.startsWith(roomWhisperPrefix)) {
        if (!conn.role) return false;
        try {
            const topics =
                (await listWhisperTopicsForUser({
                    data: { gameId: conn.gameId, userId: conn.userId, role: conn.role }
                })) ?? [];
            if (!topics.includes(topicId)) return false;
            return await shouldAllowWhisper(conn.gameId, topicId);
        } catch {
            return false;
        }
    }
    return false;
}

export async function handleWsConnection(
    ws: WebSocket,
    request: Request,
    publish?: (topic: string, msg: any) => Promise<void>
) {
    // Authenticate using your existing cookie-session helper.
    const cookie = request.headers.get('cookie');
    const sessionId = parseCookie(cookie, cookieName());
    if (!sessionId) {
        send(ws, { t: 'error', code: 'unauthorized', message: 'Not logged in' });
        ws.close();
        return;
    }
    const session = await $session.findOne(sessionId);
    if (!session) {
        send(ws, { t: 'error', code: 'unauthorized', message: 'Not logged in' });
        ws.close();
        return;
    }
    const user = session.userId;
    const conn: Conn = { ws, userId: user._id, name: user.name, topics: new Set() };

    const cleanupSubscriber = async () => {
        const subscriber = conn.subscriber;
        if (!subscriber) return;
        conn.subscriber = undefined;
        conn.topics.clear();
        try {
            await subscriber.unsubscribe();
        } catch {
            /* ignore */
        }
        try {
            await subscriber.disconnect();
        } catch {
            /* ignore */
        }
    };

    ws.on('message', async (raw) => {
        let msg: any;
        try {
            msg = JSON.parse(raw.toString());
        } catch {
            send(ws, { t: 'error', code: 'bad_json', message: 'Invalid JSON' });
            return;
        }

        const normalizedType = msg?.t ?? msg?.type;

        // joinGame
        if (msg?.t === 'joinGame') {
            const parsed = zJoinGame.safeParse(msg);
            if (!parsed.success) {
                send(ws, { t: 'error', code: 'bad_msg', message: 'Invalid joinGame message' });
                return;
            }

            const gameId = parsed.data.gameId;
            await connectMongoose();

            // Must be a member of the game
            const member = await $gameMember.findOne(gameId, user);

            if (!member) {
                send(ws, { t: 'error', code: 'not_in_game', message: 'Not a member of this game' });
                return;
            }

            const game = await $game.findById({ data: gameId });
            if (!game) {
                send(ws, { t: 'error', code: 'game_not_found', message: 'Game not found' });
                return;
            }

            conn.gameId = gameId;
            conn.role = member.role;

            await cleanupSubscriber();
            const topics = [$keys.publicTopic(gameId), $keys.roomPublicTopic(gameId)];
            if (member.role === 'storyteller') {
                topics.push($keys.stTopic(gameId), $keys.roomStTopic(gameId));
            }

            if (topics.length > 0) {
                const redis = await getRedis();
                const subscriber = redis.duplicate();
                conn.subscriber = subscriber as any;
                try {
                    await subscriber.connect();
                    await Promise.all(topics.map((topic) => subscribeToTopic(conn, topic)));
                    topics.forEach((topic) => {
                        conn.topics.add(topic);
                        send(ws, { t: 'joinedTopic', topicId: topic });
                    });
                } catch {
                    await cleanupSubscriber();
                    send(ws, {
                        t: 'error',
                        code: 'topic_join_failed',
                        message: 'Failed to join realtime topics'
                    });
                    ws.close();
                    return;
                }
            }

            // Presence + host grace cancellation
            await markConnected(gameId, conn.userId);
            await publishPresenceUpdate(gameId, conn.userId, 'connected', publish);
            await onUserConnected(gameId, conn.userId, { publish });

            // Respond to client with per-game role (host status is separate via hostUserId)
            send(ws, {
                t: 'joinedGame',
                gameId,
                you: {
                    userId: conn.userId,
                    name: conn.name,
                    role: member.role,
                    isHost: game.hostUserId === conn.userId
                }
            });

            // Reminder check: if threshold/time hit and there’s no storyteller, remind host.
            await maybeRemindPickStoryteller(gameId, {
                publish: publish ? async (topic, payload) => publish(topic, payload) : undefined
            });

            await replayFromLastStreamIds(ws, parsed.data.lastStreamIds);
            return;
        }

        if (normalizedType === 'CREATE_ROOM') {
            if (!conn.gameId) {
                send(ws, { t: 'error', code: 'not_in_game', message: 'Join a game first' });
                return;
            }
            const roomResult = zRoom.safeParse(msg?.room);
            if (!roomResult.success) {
                send(ws, { t: 'error', code: 'bad_msg', message: 'Invalid room payload' });
                return;
            }
            const room = roomResult.data;
            if (room._id !== conn.gameId) {
                send(ws, {
                    t: 'error',
                    code: 'room_mismatch',
                    message: 'Room data does not match connected game'
                });
                return;
            }
            try {
                createRoomActor(room);
                send(ws, { t: 'roomCreated', roomId: room._id });
            } catch (error) {
                console.error('[realtime] CREATE_ROOM failed', error);
                send(ws, {
                    t: 'error',
                    code: 'create_room_failed',
                    message: 'Unable to initialize room state'
                });
            }
            return;
        }

        if (msg?.t === 'ping') {
            const parsed = zPing.safeParse(msg);
            if (!parsed.success) {
                send(ws, { t: 'error', code: 'bad_msg', message: 'Invalid ping message' });
                return;
            }
            send(ws, { t: 'pong', ts: Date.now() });
            return;
        }

        if (msg?.t === 'joinTopic') {
            if (!conn.gameId) {
                send(ws, { t: 'error', code: 'not_in_game', message: 'Join a game first' });
                return;
            }
            if (!conn.subscriber) {
                send(ws, { t: 'error', code: 'topic_join_failed', message: 'Realtime connection not ready' });
                return;
            }
            const parsed = zJoinTopic.safeParse(msg);
            if (!parsed.success) {
                send(ws, { t: 'error', code: 'bad_msg', message: 'Invalid joinTopic message' });
                return;
            }
            const { topicId } = parsed.data;
            if (!(await canJoinTopic(conn, topicId))) {
                send(ws, { t: 'error', code: 'not_allowed', message: 'Cannot join this topic' });
                return;
            }
            if (conn.topics.has(topicId)) {
                send(ws, { t: 'joinedTopic', topicId });
                return;
            }
            try {
                await subscribeToTopic(conn, topicId);
            } catch {
                send(ws, { t: 'error', code: 'topic_join_failed', message: 'Failed to join topic' });
                return;
            }
            conn.topics.add(topicId);
            send(ws, { t: 'joinedTopic', topicId });
            return;
        }

        if (msg?.t === 'chat') {
            if (!conn.gameId) {
                send(ws, { t: 'error', code: 'not_in_game', message: 'Join a game first' });
                return;
            }
            const parsed = zChat.safeParse(msg);
            if (!parsed.success) {
                send(ws, { t: 'error', code: 'bad_msg', message: 'Invalid chat message' });
                return;
            }
            const { topicId, text } = parsed.data;
            if (!conn.topics.has(topicId)) {
                send(ws, { t: 'error', code: 'topic_not_joined', message: 'Join the topic before chatting' });
                return;
            }
            const chatEvent = {
                kind: 'chat',
                id: randomUUID(),
                ts: Date.now(),
                from: { userId: conn.userId, name: conn.name },
                text
            };
            let eventToSend: ChatMsg | (ChatMsg & { streamId: string }) = chatEvent;
            if (publish) {
                try {
                    eventToSend = await publish(topicId, chatEvent);
                } catch {
                    send(ws, { t: 'error', code: 'publish_failed', message: 'Failed to broadcast chat' });
                    return;
                }
            }
            send(ws, { t: 'chatSent', topicId, event: eventToSend });
            return;
        }

        if (msg?.t === 'gameEvent') {
            if (!conn.gameId) {
                send(ws, { t: 'error', code: 'not_in_game', message: 'Join a game first' });
                return;
            }
            const matchId = await ensureMatchId(conn);
            if (!matchId) {
                send(ws, { t: 'error', code: 'match_not_active', message: 'No active match' });
                return;
            }
            const eventPayload = msg.event;
            if (!eventPayload || typeof eventPayload.type !== 'string') {
                send(ws, { t: 'error', code: 'bad_msg', message: 'Invalid game event' });
                return;
            }
            void sendGameEvent(matchId, eventPayload as GameEvents);
            send(ws, { t: 'gameEventAck', matchId, type: eventPayload.type });
            return;
        }

        send(ws, { t: 'error', code: 'bad_msg', message: 'Unknown message type' });
    });

    ws.on('close', async () => {
        await cleanupSubscriber();
        if (!conn.gameId) return;
        const gameId = conn.gameId;

        await markDisconnected(gameId, conn.userId);
        await publishPresenceUpdate(gameId, conn.userId, 'disconnected', publish);
        await onUserDisconnected(gameId, conn.userId, { publish });

        // Reminder check again after disconnect (might trigger “pick storyteller” as players cross min threshold,
        // or just for good measure—throttled anyway)
        await maybeRemindPickStoryteller(gameId, {
            publish: publish ? async (topic, payload) => publish(topic, payload) : undefined
        });
    });
}

const MAX_REPLAY_ITEMS = 200;

async function replayFromLastStreamIds(ws: WebSocket, lastStreamIds?: Record<string, string>) {
    if (!lastStreamIds) return;
    const entries = Object.entries(lastStreamIds);
    if (entries.length === 0) return;
    await Promise.all(entries.map(([topic, streamId]) => replayTopicMessages(ws, topic, streamId)));
}

async function replayTopicMessages(ws: WebSocket, topic: string, lastStreamId: string) {
    try {
        const redis = await getRedis();
        const streamKey = streamKeyForTopic(topic);
        let entries: Array<[string, Record<string, string>]> = [];
        if (lastStreamId) {
            const start = `(${lastStreamId}`;
            entries = await redis.xRange(streamKey, start, '+', { COUNT: MAX_REPLAY_ITEMS });
        } else {
            const reversed = await redis.xRevRange(streamKey, '+', '-', { COUNT: MAX_REPLAY_ITEMS });
            entries = reversed.reverse();
        }

        if (entries.length === 0) return;

        const roomId = getRoomIdFromTopic(topic);
        const payloads: Record<string, unknown>[] = [];

        for (const [streamId, fields] of entries) {
            const raw = fields?.payload;
            if (!raw || typeof raw !== 'string') continue;
            let parsed: unknown;
            try {
                parsed = JSON.parse(raw);
            } catch {
                continue;
            }
            if (typeof parsed !== 'object' || parsed === null) continue;
            const payloadContent = parsed as Record<string, unknown>;

            const ts = timestampFromStreamId(streamId);
            payloads.push({
                ...payloadContent,
                ts,
                streamId,
                topicId: topic,
                ...(roomId ? { roomId } : {})
            });
        }

        if (payloads.length === 0) return;

        send(ws, {
            t: 'topicReplay',
            topic,
            payloads
        });
    } catch {
        /* intentionally ignore replay failures */
    }
}
