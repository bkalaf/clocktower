// src/server/realtime/wsConnection.ts
import { createActor } from 'xstate';
import type { WebSocket } from 'ws';
import type {
    IncomingMessage,
    OutgoingMessage,
    SessionSnapshotContext,
    SessionStateValue
} from '@/shared/realtime/messages';
import { roomActors } from '../roomService';
import { SessionMachine } from '../machines/SessionMachine';

export type WsClient = WebSocket & { id?: string };

export type RoomBroadcaster = (roomId: string, msg: OutgoingMessage) => void;
export type SubscribeFn = (roomId: string, ws: WsClient) => void;
export type UnsubscribeFn = (roomId: string, ws: WsClient) => void;
export type UnsubscribeAllFn = (ws: WsClient) => void;

function safeSend(ws: WsClient, msg: OutgoingMessage) {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify(msg));
}

function parse(raw: WebSocket.RawData): IncomingMessage {
    const txt = typeof raw === 'string' ? raw : raw.toString('utf8');
    return JSON.parse(txt) as IncomingMessage;
}

export function createWsConnection(opts: {
    ws: WsClient;
    subscribe: SubscribeFn;
    unsubscribe: UnsubscribeFn;
    unsubscribeAll: UnsubscribeAllFn;
    listRooms: () => Promise<RoomSummary[]>;
    broadcastRoomsList: (rooms: RoomSummary[]) => void;

    // Broadcast hook passed to roomService when creating an actor.
    // roomService will call it with {type:'ROOM_SNAPSHOT', ...} and wsServer should route it to subscribers.
    broadcast: (msg: unknown) => void;
}) {
    const { ws, subscribe, unsubscribe, unsubscribeAll, broadcast, listRooms, broadcastRoomsList } = opts;
    const sendRoomsList = (requestId?: string) => {
        listRooms().then((rooms) =>
            safeSend(ws, {
                type: 'ROOMS_LIST',
                rooms,
                requestId
            })
        );
    };

    const sessionService = createActor(SessionMachine, {
        input: {
            ws,
            subscribe,
            unsubscribe,
            unsubscribeAll,
            broadcast,
            listRooms,
            broadcastRoomsList,
            send: (msg) => safeSend(ws, msg)
        }
    });
    sessionService.start();

    const sessionSnapshotSubscription = sessionService.subscribe((state) => {
        const snapshotContext: SessionSnapshotContext = {
            userId: state.context.userId,
            username: state.context.username,
            currentRoomId: state.context.currentRoomId,
            isRoomHost: state.context.isRoomHost
        };
        safeSend(ws, {
            type: 'SESSION_SNAPSHOT',
            snapshot: {
                value: state.value as SessionStateValue,
                context: snapshotContext
            }
        });
    });

    const teardown = () => {
        sessionSnapshotSubscription.unsubscribe();
        sessionService.stop();
        unsubscribeAll(ws);
    };

    ws.on('message', async (raw) => {
        let msg: IncomingMessage;
        try {
            msg = parse(raw);
        } catch {
            safeSend(ws, { type: 'ERROR', message: 'Invalid JSON message' });
            return;
        }

        switch (msg.type) {
            case 'CREATE_ROOM': {
                sessionService.send({ type: 'CREATE_ROOM', room: msg.room, requestId: msg.requestId });
                return;
            }

            case 'LOGIN_SUCCESS': {
                sessionService.send({ type: 'LOGIN_SUCCESS', userId: msg.userId, username: msg.username });
                return;
            }

            case 'JOIN_ROOM': {
                const { roomId } = msg;
                const actor = roomActors.get(roomId);

                if (!actor) {
                    safeSend(ws, {
                        type: 'ERROR',
                        requestId: msg.requestId,
                        message: `Room not found: ${roomId}`
                    });
                    return;
                }

                subscribe(roomId, ws);
                safeSend(ws, { type: 'JOINED_ROOM', roomId });

                const snap = actor.getSnapshot();
                safeSend(ws, {
                    type: 'ROOM_SNAPSHOT',
                    roomId,
                    snapshot: { value: snap.value, context: snap.context }
                });
                sessionService.send({ type: 'ENTER_ROOM', roomId });
                return;
            }

            case 'LEAVE_ROOM': {
                unsubscribe(msg.roomId, ws);
                sessionService.send({ type: 'LEAVE_ROOM' });
                return;
            }

            case 'ROOM_EVENT': {
                const actor = roomActors.get(msg.roomId);
                if (!actor) {
                    safeSend(ws, {
                        type: 'ERROR',
                        requestId: msg.requestId,
                        message: `Room not found: ${msg.roomId}`
                    });
                    return;
                }

                actor.send(msg.event);
                return;
            }

            case 'LIST_ROOMS': {
                sendRoomsList(msg.requestId);
                return;
            }

            default: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                safeSend(ws, { type: 'ERROR', requestId: (msg as any).requestId, message: 'Unknown message type' });
                return;
            }
        }
    });

    ws.on('close', teardown);
    ws.on('error', teardown);
}
