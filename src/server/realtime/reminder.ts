// src/server/realtime/reminder.ts
import { $keys } from '../../$keys';
import { connectMongoose } from '../../db/connectMongoose';
import { GameModel } from '../../db/models/game';
import { getRedis } from '../../redis';
import { $countDocuments, $findById } from '../findById';
import { getConnectedUserIds } from './presence';

export type PublishFn = (topic: string, msg: any) => Promise<void> | void;

type RemindersDeps = {
    publish?: PublishFn;
};

// Core: check and maybe emit reminder
export async function maybeRemindPickStoryteller(gameId: string, deps: RemindersDeps = {}) {
    await connectMongoose();
    const game = await $findById.game(gameId);
    if (!game) return;
    if (game.status !== 'idle') return;

    // If there's already a storyteller, no reminder needed.
    const stCount = await $countDocuments.gameMember(gameId, 'storyteller');
    if (stCount > 0) return;

    const connectedIds = await getConnectedUserIds(gameId);
    const connectedCount = connectedIds.length;

    const minPlayers = game.lobbySettings?.minPlayers ?? 0;
    const plannedStartTime =
        game.lobbySettings?.plannedStartTime ? new Date(game.lobbySettings.plannedStartTime).getTime() : null;

    const now = Date.now();
    const meetsMin = minPlayers > 0 && connectedCount >= minPlayers;
    const meetsTime = plannedStartTime != null && now >= plannedStartTime;

    if (!meetsMin && !meetsTime) return;

    // throttle to avoid spam
    const r = await getRedis();
    const already = await r.get($keys.reminderKey(gameId));
    if (already) return;

    // set throttle TTL (10 minutes)
    await r.set($keys.reminderKey(gameId), '1', { EX: 600 });

    // Remind host. We publish to the public topic so everyone can see the cue,
    // or you can target host-only via your own channel later.
    const payload = {
        kind: 'event',
        type: 'system/reminderPickStoryteller',
        ts: Date.now(),
        payload: {
            gameId,
            reason: meetsMin ? 'minPlayersMet' : 'plannedStartTimePassed',
            connectedCount,
            minPlayers,
            plannedStartTime
        }
    };

    // If you have a realtime publish hook, call it. Otherwise noop.
    if (deps.publish) {
        await deps.publish($keys.publicTopic(gameId), payload);
        await deps.publish($keys.stTopic(gameId), payload); // ST view also gets it
    }
}
