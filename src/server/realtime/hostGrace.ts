// src/server/realtime/hostGrace.ts

import { HostGraceDeps } from '.';
import { $keys } from '../../$keys';
import { connectMongoose } from '../../db/connectMongoose';
import { GameModel } from '../../db/models/Game';
import { GameMemberModel } from '../../db/models/GameMember';
import { getRedis } from '../../redis';
import { GameId, UserId } from '../../types/game';
import { setEnded, setHostUserId } from '../game';
import { getConnectedUserIds, connectedCount } from './presence';

// in-process timers as a convenience; Redis TTL is the source of truth
const timers = new Map<string, NodeJS.Timeout>();

async function endGame(gameId: GameId, deps: HostGraceDeps = {}) {
    await connectMongoose();
    await setEnded(gameId);
    if (deps.publish) {
        const payload = {
            kind: 'event',
            type: 'system/gameEnded',
            ts: Date.now(),
            payload: { gameId }
        };

        await Promise.all([
            deps.publish($keys.publicTopic(gameId), payload),
            deps.publish($keys.stTopic(gameId), payload)
        ]);
    }
}

async function chooseNewHost(
    gameId: GameId,
    connectedIds: UserId[],
    preferStoryteller: boolean
): Promise<UserId | null> {
    await connectMongoose();

    if (preferStoryteller) {
        const st = await GameMemberModel.find({
            gameId,
            userId: { $in: connectedIds },
            role: 'storyteller'
        })
            .sort({ joinedAt: 1, userId: 1 })
            .lean();

        if (st.length > 0) {
            const value = st[0];
            return value.userId;
        }
    }

    const choices = await GameMemberModel.find({
        gameId,
        userId: { $in: connectedIds }
    })
        .sort({ joinedAt: 1, userId: 1 })
        .lean();

    return choices[0]?.userId ?? null;
}

async function resolveGrace(gameId: GameId, hostUserId: UserId, deps: HostGraceDeps = {}) {
    const r = await getRedis();

    const graceVal = await r.get($keys.graceKey(gameId));
    if (graceVal !== hostUserId) return; // grace was canceled or replaced

    const connectedIds = await getConnectedUserIds(gameId);

    // host came back
    if (connectedIds.includes(hostUserId)) {
        await r.del($keys.graceKey(gameId));
        return;
    }

    // no one else connected => end
    if (connectedIds.length === 0) {
        await r.del($keys.graceKey(gameId));
        await endGame(gameId, deps);
        return;
    }

    // confirm current host still the same
    await connectMongoose();
    const game = await GameModel.findById(gameId).lean();
    if (!game || game.status === 'archived') {
        await r.del($keys.graceKey(gameId));
        return;
    }
    if (game.hostUserId !== hostUserId) {
        await r.del($keys.graceKey(gameId));
        return;
    }

    // Determine if old host was storyteller
    const oldMember = await GameMemberModel.findOne({ gameId, userId: hostUserId }).lean();
    const oldWasStoryteller = !![oldMember?.role]?.includes('storyteller');

    // Primary: oldest connected storyteller
    // Fallback: if old host was storyteller and no storyteller connected, choose oldest connected member
    const newHost =
        (await chooseNewHost(gameId, connectedIds, true)) ??
        (oldWasStoryteller ?
            await chooseNewHost(gameId, connectedIds, false)
        :   await chooseNewHost(gameId, connectedIds, false));

    if (!newHost) {
        await r.del($keys.graceKey(gameId));
        await endGame(gameId, deps);
        return;
    }

    await setHostUserId(gameId, newHost);
    await r.del($keys.graceKey(gameId));

    // TODO publish: hostChanged { from: hostUserId, to: newHost }
}

export async function onUserConnected(gameId: string, userId: string, deps: HostGraceDeps = {}) {
    const r = await getRedis();
    const current = await r.get($keys.graceKey(gameId));
    if (current === userId) {
        await r.del($keys.graceKey(gameId));
        const t = timers.get(gameId);
        if (t) {
            clearTimeout(t);
            timers.delete(gameId);
        }
        if (deps.publish) {
            const payload = {
                kind: 'event',
                type: 'system/hostGraceCanceled',
                ts: Date.now(),
                payload: { gameId, hostUserId: userId }
            };

            await Promise.all([
                deps.publish($keys.publicTopic(gameId), payload),
                deps.publish($keys.stTopic(gameId), payload)
            ]);
        }
    }
}

export async function onUserDisconnected(gameId: GameId, userId: UserId, deps: HostGraceDeps = {}) {
    // If host left and no one else is connected => end immediately (no grace)
    await connectMongoose();
    const game = await GameModel.findById(gameId).lean();
    if (!game || game.status === 'archived') return;
    if (game.hostUserId !== userId) return;

    const count = await connectedCount(gameId);
    if (count === 0) {
        await endGame(gameId, deps);
        return;
    }

    // start grace
    const r = await getRedis();
    const now = Date.now();
    const untilTs = now + 300_000;
    await r.set($keys.graceKey(gameId), userId, { EX: 300 });

    // schedule local timer too (ok if process restarts; Redis is truth)
    if (timers.has(gameId)) clearTimeout(timers.get(gameId)!);
    const timer = setTimeout(() => {
        resolveGrace(gameId, userId, deps).catch(() => {});
    }, 300_000);
    timers.set(gameId, timer);

    if (deps.publish) {
        const payload = {
            kind: 'event',
            type: 'system/hostGraceStarted',
            ts: now,
            payload: { gameId, hostUserId: userId, untilTs }
        };

        await Promise.all([
            deps.publish($keys.publicTopic(gameId), payload),
            deps.publish($keys.stTopic(gameId), payload)
        ]);
    }
}
