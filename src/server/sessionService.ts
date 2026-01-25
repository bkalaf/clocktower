// src/server/sessionService.ts
import { ActorRefFrom, createActor } from 'xstate';
import type { OutgoingMessage } from '@/shared/realtime/messages';
import { SessionMachine, type SessionMachineInput } from './machines/SessionMachine';

export const sessionActors = new Map<string, ActorRefFrom<typeof SessionMachine>>();

export const createServerSessionInput = (): SessionMachineInput => {
    const wsPlaceholder = {} as SessionMachineInput['ws'];
    return {
        ws: wsPlaceholder,
        subscribe: (_roomId: string, _ws: SessionMachineInput['ws']) => undefined,
        unsubscribe: (_roomId: string, _ws: SessionMachineInput['ws']) => undefined,
        unsubscribeAll: (_ws: SessionMachineInput['ws']) => undefined,
        broadcast: (_msg: unknown) => undefined,
        listRooms: async () => [],
        broadcastRoomsList: (_rooms: RoomSummary[]) => undefined,
        send: (_msg: OutgoingMessage) => undefined
    };
};

export function ensureSessionActor(sessionId: string, input?: SessionMachineInput) {
    const existing = sessionActors.get(sessionId);
    if (existing) {
        return existing;
    }
    return createSessionActor(sessionId, input);
}

export function createSessionActor(sessionId: string, input?: SessionMachineInput) {
    stopSessionActor(sessionId);
    const actor = createActor(SessionMachine, {
        input: input ?? createServerSessionInput()
    });
    actor.start();
    sessionActors.set(sessionId, actor);
    return actor;
}

export function getSessionActor(sessionId: string) {
    return sessionActors.get(sessionId);
}

export function stopSessionActor(sessionId: string) {
    const actor = sessionActors.get(sessionId);
    if (!actor) {
        return;
    }
    actor.stop();
    sessionActors.delete(sessionId);
}
