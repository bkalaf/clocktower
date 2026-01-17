/* eslint-disable @typescript-eslint/no-explicit-any */
// src/server/realtime/wsConnection.ts
import type WebSocket from 'ws';
import { markConnected, markDisconnected } from './presence';
import { onUserConnected, onUserDisconnected } from './hostGrace';
import { getUserFromReq } from '../getUserFromReq';
import { zJoinGame } from '.';
import { connectMongoose } from '../../db/connectMongoose';
import { $findById, $findOne } from '../findById';
import { maybeRemindPickStoryteller } from './reminder';

type Conn = {
    ws: WebSocket;
    userId: string;
    name: string;
    gameId?: string;
};

function send(ws: WebSocket, obj: any) {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(obj));
}

export async function handleWsConnection(
    ws: WebSocket,
    request: Request,
    publish?: (topic: string, msg: any) => Promise<void>
) {
    // Authenticate using your existing cookie-session helper.
    const user = await getUserFromReq(request);
    if (!user) {
        send(ws, { t: 'error', code: 'unauthorized', message: 'Not logged in' });
        ws.close();
        return;
    }

    const conn: Conn = { ws, userId: user._id, name: user.name };

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
            const member = await $findOne.gameMember(gameId, conn.userId);

            if (!member) {
                send(ws, { t: 'error', code: 'not_in_game', message: 'Not a member of this game' });
                return;
            }

            const game = await $findById.game(gameId);
            if (!game) {
                send(ws, { t: 'error', code: 'game_not_found', message: 'Game not found' });
                return;
            }

            conn.gameId = gameId;

            // Presence + host grace cancellation
            await markConnected(gameId, conn.userId);
            await onUserConnected(gameId, conn.userId);

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

            // TODO: join topics (public always; st only if storyteller)
            // TODO: replay from lastStreamIds per topic
            return;
        }

        // TODO: joinTopic, chat, ping, etc.
    });

    ws.on('close', async () => {
        if (!conn.gameId) return;
        const gameId = conn.gameId;

        await markDisconnected(gameId, conn.userId);
        await onUserDisconnected(gameId, conn.userId);

        // Reminder check again after disconnect (might trigger “pick storyteller” as players cross min threshold,
        // or just for good measure—throttled anyway)
        await maybeRemindPickStoryteller(gameId, {
            publish: publish ? async (topic, payload) => publish(topic, payload) : undefined
        });
    });
}
