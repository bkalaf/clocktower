/* eslint-disable @typescript-eslint/no-explicit-any */
// src/server/realtime/wsConnection.ts
import { randomUUID } from 'crypto';
import type { RedisClientType } from 'redis';
import type WebSocket from 'ws';
import { markConnected, markDisconnected } from './presence';
import { onUserConnected, onUserDisconnected } from './hostGrace';
import { zChat, zJoinGame, zJoinTopic, zPing } from '.';
import { connectMongoose } from '../../db/connectMongoose';
import { getRedis } from '../../redis';
import { $keys } from '../../$keys';
import { listWhisperTopicsForUser } from '../../serverFns/listWhisperTopicsForUser';
import { AuthedUser, GameRoles } from '../../types/game';
import { maybeRemindPickStoryteller } from './reminder';
import { ChatItem, ChatItemModel } from '@/db/models/ChatItem';
import { getUserFromCookie } from '../../serverFns/getId/getUserFromCookie';
import $gameMember from '../../serverFns/$gameMember';
import $models from '../../db/models';
import $game from '../../serverFns/$game';
import { whoAmIServerFn } from '../../serverFns/whoAmI';
import { parseCookie } from '../parseCookie';
import { cookieName } from '../auth/cookies';
import $session from '../../serverFns/$session';

type Conn = {
    ws: WebSocket;
    userId: string;
    name: string;
    gameId?: string;
    role?: GameRoles;
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
    if (!topicId.startsWith(`game:${conn.gameId}:`)) return false;
    if (topicId === $keys.publicTopic(conn.gameId)) return true;
    if (topicId === $keys.stTopic(conn.gameId)) return conn.role === 'storyteller';
    if (topicId.startsWith(`game:${conn.gameId}:whisper:`)) {
        if (!conn.role) return false;
        try {
            const topics =
                (await listWhisperTopicsForUser({
                    data: { gameId: conn.gameId, userId: conn.userId, role: conn.role }
                })) ?? [];
            return topics.includes(topicId);
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
            const topics = [$keys.publicTopic(gameId)];
            if (member.role === 'storyteller') {
                topics.push($keys.stTopic(gameId));
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
            if (publish) {
                try {
                    await publish(topicId, chatEvent);
                } catch {
                    send(ws, { t: 'error', code: 'publish_failed', message: 'Failed to broadcast chat' });
                    return;
                }
            }
            send(ws, { t: 'chatSent', topicId, event: chatEvent });
            return;
        }

        send(ws, { t: 'error', code: 'bad_msg', message: 'Unknown message type' });
    });

    ws.on('close', async () => {
        await cleanupSubscriber();
        if (!conn.gameId) return;
        const gameId = conn.gameId;

        await markDisconnected(gameId, conn.userId);
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
        const lastDoc = (await $models.ChatItemModel.findOne({ topicId: topic, streamId: lastStreamId })
            .select('ts streamId')
            .lean()) as Pick<ChatItem, 'ts' | 'streamId'>;

        if (!lastDoc?.ts) {
            return;
        }

        const filter: Record<string, unknown> = {
            topicId: topic,
            $or: [{ createdAt: { $gt: lastDoc.ts } }, { createdAt: lastDoc.ts, streamId: { $gt: lastStreamId } }]
        };

        const items = await ChatItemModel.find(filter)
            .sort({ createdAt: 1, streamId: 1 })
            .limit(MAX_REPLAY_ITEMS)
            .lean();

        if (items.length === 0) return;

        send(ws, {
            t: 'topicReplay',
            topic,
            payloads: items.map((item) => ({
                _id: item._id,
                gameId: item.gameId,
                topicId: item.topicId,
                from: item.from,
                text: item.text,
                ts: item.ts,
                streamId: item.streamId
            }))
        });
    } catch {
        /* intentionally ignore replay failures */
    }
}
