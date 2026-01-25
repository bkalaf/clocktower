// src/server/machines/SessionMachine.ts
import { Action, ActionArgs, ActionFunction, ActorRefFrom, assign, setup } from 'xstate';
import type { WebSocket } from 'ws';
import { createRoomActor, getRoomActor, roomActors } from '../roomService';
import { createRoomMachine } from './RoomMachine';
import type { OutgoingMessage, SessionSnapshotContext } from '@/shared/realtime/messages';

export type SessionMachineInput = {
    ws: WebSocket;
    subscribe: (roomId: string, ws: WebSocket) => void;
    unsubscribe: (roomId: string, ws: WebSocket) => void;
    unsubscribeAll: (ws: WebSocket) => void;
    broadcast: (msg: unknown) => void;
    listRooms: () => Promise<RoomSummary[]>;
    broadcastRoomsList: (rooms: RoomSummary[]) => void;
    send: (msg: OutgoingMessage) => void;
};

type SessionMachineContext = SessionSnapshotContext & {
    roomActor?: ActorRefFrom<typeof createRoomMachine>;
    deps?: SessionMachineInput;
};

const baseContext: SessionMachineContext = {
    userId: undefined,
    username: '',
    currentRoomId: undefined,
    isRoomHost: false,
    roomActor: undefined,
    deps: undefined
};

type SessionEvent =
    | { type: 'LOGIN_SUCCESS'; userId: string; username: string }
    | { type: 'LOGOUT' }
    | { type: 'CREATE_ROOM'; room: Room; requestId?: string }
    | { type: 'ENTER_ROOM'; roomId: string }
    | { type: 'LEAVE_ROOM' };

const assignSession = assign<SessionMachineContext, SessionEvent, undefined, SessionEvent, never>;

const membershipForUser = (userId?: string) => {
    if (!userId) return undefined;
    for (const [roomId, actor] of roomActors.entries()) {
        const { room } = actor.getSnapshot().context;
        if (!room) continue;
        if (room.hostUserId === userId) return { roomId, isRoomHost: true };
        if (room.connectedUserIds && room.connectedUserIds[userId] !== undefined) {
            return { roomId, isRoomHost: false };
        }
    }
    return undefined;
};

const sendRoomCreatedAndBroadcast = async (deps: SessionMachineInput, roomId: string, requestId?: string) => {
    try {
        const rooms = await deps.listRooms();
        const createdRoom =
            rooms.find((candidate) => candidate.roomId === roomId) ?? ({ roomId, playerCount: 0 } as RoomSummary);
        deps.send({ type: 'ROOM_CREATED', room: createdRoom, requestId });
        deps.broadcastRoomsList(rooms);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to refresh rooms';
        deps.send({
            type: 'ERROR',
            requestId,
            message
        });
    }
};

const notifyRoomCreation = (args: ActionArgs<SessionMachineContext, SessionEvent, SessionEvent>) => {
    const { context, event } = args;
    if (event.type !== 'CREATE_ROOM') return;
    const deps = context.deps;
    const actor = context.roomActor;
    if (!deps) return;
    const roomId = event.room._id;

    try {
        deps.subscribe(roomId, deps.ws);
        deps.send({ type: 'JOINED_ROOM', roomId });
    } catch (error) {
        deps.send({
            type: 'ERROR',
            requestId: event.requestId,
            message: error instanceof Error ? error.message : 'Failed to join room'
        });
        return;
    }

    if (actor) {
        const snapshot = actor.getSnapshot();
        deps.send({
            type: 'ROOM_SNAPSHOT',
            roomId,
            snapshot: {
                value: snapshot.value,
                context: snapshot.context
            }
        });
    }

    void sendRoomCreatedAndBroadcast(deps, roomId, event.requestId);
};

const assignLoginContext = assignSession(({ context, event }) => {
    if (event.type !== 'LOGIN_SUCCESS') return {};
    const membership = membershipForUser(event.userId);
    const actor =
        membership?.roomId && getRoomActor(membership.roomId) ? getRoomActor(membership.roomId) : context.roomActor;
    return {
        userId: event.userId,
        username: event.username,
        currentRoomId: membership?.roomId,
        isRoomHost: membership?.isRoomHost ?? false,
        roomActor: actor
    };
});

const assignRoomContext = assignSession(({ context, event }) => {
    if (event.type !== 'CREATE_ROOM') return {};
    const deps = context.deps;
    if (!deps) return {};
    const actor = createRoomActor(event.room, deps.broadcast);
    return {
        currentRoomId: event.room._id,
        isRoomHost: true,
        roomActor: actor
    };
});

const clearRoomContext = assignSession(({ context }) => {
    if (context.deps && context.currentRoomId) {
        context.deps.unsubscribe(context.currentRoomId, context.deps.ws);
    }
    return {
        currentRoomId: undefined,
        isRoomHost: false,
        roomActor: undefined
    };
});

const assignEnteredRoom = assignSession(({ context, event }) => {
    if (event.type !== 'ENTER_ROOM') return {};
    const actor = getRoomActor(event.roomId);
    const membership = membershipForUser(context.userId);
    return {
        currentRoomId: event.roomId,
        roomActor: actor ?? context.roomActor,
        isRoomHost: membership?.roomId === event.roomId ? membership.isRoomHost : false
    };
});

const logoutCleanup = ({ context }: { context: SessionMachineContext }) => {
    context.deps?.unsubscribeAll(context.deps.ws);
};

const resetSessionContext = assignSession(({ context }) => ({
    ...baseContext,
    deps: context.deps
}));

const isInRoom = ({ event }: { event: SessionEvent }) =>
    event.type === 'LOGIN_SUCCESS' && !!membershipForUser(event.userId);

export const SessionMachine = setup({
    types: {} as {
        context: SessionMachineContext;
        events: SessionEvent;
        input: SessionMachineInput;
    },
    guards: {
        hasUserId: ({ context }) => Boolean(context.userId)
    }
}).createMachine({
    id: 'SessionMachine',
    context: ({ input }) => ({ ...baseContext, deps: input }),
    initial: 'unauthenticated',
    states: {
        unauthenticated: {
            on: {
                LOGIN_SUCCESS: [
                    {
                        target: 'in_room',
                        guard: isInRoom,
                        actions: assignLoginContext
                    },
                    {
                        target: 'lobby',
                        actions: assignLoginContext
                    }
                ]
            }
        },
        lobby: {
            always: {
                guard: isInRoom,
                target: 'in_room'
            },
            on: {
                CREATE_ROOM: [
                    {
                        target: 'in_room',
                        guard: 'hasUserId',
                        actions: [assignRoomContext, notifyRoomCreation]
                    }
                ],
                ENTER_ROOM: {
                    target: 'in_room',
                    actions: assignEnteredRoom
                },
                LOGOUT: {
                    target: 'unauthenticated',
                    actions: [clearRoomContext, logoutCleanup, resetSessionContext]
                }
            }
        },
        in_room: {
            on: {
                LEAVE_ROOM: {
                    target: 'lobby',
                    actions: clearRoomContext
                },
                LOGOUT: {
                    target: 'unauthenticated',
                    actions: [clearRoomContext, logoutCleanup, resetSessionContext]
                }
            }
        }
    }
});
