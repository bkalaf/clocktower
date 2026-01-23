// src/server/realtime/wsConnection.ts
import type { WebSocket } from 'ws';
import { createRoomActor, roomActors } from '../roomService';

export type WsClient = WebSocket & { id?: string };

export type IncomingMessage =
    | { type: 'CREATE_ROOM'; room: Room; requestId?: string }
    | { type: 'JOIN_ROOM'; roomId: string; userId?: string; requestId?: string }
    | { type: 'LEAVE_ROOM'; roomId: string; requestId?: string }
    | { type: 'ROOM_EVENT'; roomId: string; event: RoomEvents; requestId?: string };

export type OutgoingMessage =
    | { type: 'ROOM_SNAPSHOT'; roomId: string; snapshot: RoomSnapshotPayload }
    | { type: 'JOINED_ROOM'; roomId: string }
    | { type: 'ERROR'; requestId?: string; message: string };

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

    // Broadcast hook passed to roomService when creating an actor.
    // roomService will call it with {type:'ROOM_SNAPSHOT', ...} and wsServer should route it to subscribers.
    broadcast: (msg: unknown) => void;
}) {
    const { ws, subscribe, unsubscribe, unsubscribeAll, broadcast } = opts;

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
                try {
                    const room = msg.room;
                    const actor = createRoomActor(room, { broadcast });

                    // auto-join creator
                    subscribe(room._id, ws);

                    safeSend(ws, { type: 'JOINED_ROOM', roomId: room._id });

                    const snap = actor.getSnapshot();
                    safeSend(ws, {
                        type: 'ROOM_SNAPSHOT',
                        roomId: room._id,
                        snapshot: { value: snap.value, context: snap.context }
                    });
                } catch (e: any) {
                    safeSend(ws, {
                        type: 'ERROR',
                        requestId: msg.requestId,
                        message: e?.message ?? 'Failed to create room'
                    });
                }
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
                return;
            }

            case 'LEAVE_ROOM': {
                unsubscribe(msg.roomId, ws);
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

            default: {
                safeSend(ws, { type: 'ERROR', requestId: (msg as any).requestId, message: 'Unknown message type' });
                return;
            }
        }
    });

    ws.on('close', () => unsubscribeAll(ws));
    ws.on('error', () => unsubscribeAll(ws));
}
