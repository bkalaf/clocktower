// src/server/gameService.ts
import { randomUUID } from 'crypto';
import { createActor, type ActorRefFrom } from 'xstate';
import { env } from '@/env';
import { publish } from '@/server/_authed.rooms.index.tsx/publish';
import { $keys } from '@/keys';
import { GameMachine, type GameEvents, type GameMachineWsEvent } from '@/server/machines/GameMachine';
import { instrumentXStateActor } from '@/server/logging/xstateLogger';
import { AppEvents } from '@/types/game';

const actors = new Map<string, ActorRefFrom<typeof GameMachine>>();
const taskStarted = new Set<string>();

const topicNames = (roomId: string) => [
    $keys.publicTopic(roomId),
    $keys.stTopic(roomId),
    $keys.roomPublicTopic(roomId),
    $keys.roomStTopic(roomId)
];

const toAppEvent = (event: GameMachineWsEvent): AppEvents => {
    const base = { kind: 'event' as const, id: randomUUID(), ts: Date.now(), version: 0 };
    switch (event.type) {
        case 'dawnBreak':
            return { ...base, type: 'game/dawnBreak', payload: { requireConfirm: event.requireConfirm } };
        case 'deathsRevealed':
            return { ...base, type: 'game/deathsRevealed', payload: { deaths: event.payload } };
        case 'requestStatement':
            return { ...base, type: 'game/requestStatement', payload: { seatId: event.payload } };
        case 'statementBroadcast':
            return { ...base, type: 'game/statementBroadcast', payload: event.payload };
        case 'voteStarted':
            return { ...base, type: 'game/voteStarted', payload: event.payload };
        case 'nominationRejected':
            return { ...base, type: 'game/nominationRejected', payload: event.payload };
        case 'gong':
            return { ...base, type: 'game/gong', payload: undefined };
        case 'taskStarted':
            return { ...base, type: 'game/taskStarted', payload: { task: event.payload } };
    }
};

const publishEvent = async (roomId: string, event: GameMachineWsEvent) => {
    const msg = toAppEvent(event);
    await Promise.all(topicNames(roomId).map((topic) => publish(topic, msg)));
};

export type StartGameMachineArgs = {
    roomId: string;
    matchId: string;
    maxPlayers: number;
    connectedUserIds: Record<string, GameRoles>;
    storytellerMode: StorytellerMode;
    scriptId: string;
};

export function startGameMachine(args: StartGameMachineArgs) {
    if (actors.has(args.matchId)) {
        return actors.get(args.matchId)!;
    }

    const actor = createActor(GameMachine, {
        input: {
            maxPlayers: args.maxPlayers,
            connectedUserIds: args.connectedUserIds,
            storytellerMode: args.storytellerMode,
            scriptId: args.scriptId,
            deps: {
                wsEmit: (event) => {
                    void publishEvent(args.roomId, event);
                }
            }
        }
    });

    instrumentXStateActor(actor, {
        logDir: env.XSTATE_LOG_DIR,
        machineName: 'GameMachine',
        machineId: args.matchId,
        serviceName: 'xstate'
    });

    actor.subscribe((state) => {
        if (
            state.event?.type === 'SETUP_COMPLETE' &&
            !taskStarted.has(args.matchId) &&
            state.context.tasks.length > 0
        ) {
            actor.send({ type: 'START_TASKS' });
            taskStarted.add(args.matchId);
        }

        if (typeof state.matches === 'function' && state.matches('gameStatus.complete')) {
            actor.stop();
            actors.delete(args.matchId);
            taskStarted.delete(args.matchId);
        }
    });

    actor.start();
    actors.set(args.matchId, actor);
    return actor;
}

export function sendGameEvent(matchId: string, event: GameEvents) {
    const actor = actors.get(matchId);
    if (!actor) return;
    actor.send(event);
}
