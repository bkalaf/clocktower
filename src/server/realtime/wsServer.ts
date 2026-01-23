// src/server/wsServer.ts
//
// A practical WebSocket server for your architecture:
// - UI never reads Mongo; UI only receives snapshots via WS.
// - Server is source of truth via XState actors (RoomMachine -> invokes GameMachine).
// - Mongo is backup-only: server persists snapshots + rehydrates on boot.
//
// Assumptions:
// - You're using the `ws` package.
// - You already implemented:
//   - createRoomActor(room, broadcast) in ./roomService
//   - rehydrateAllRooms(broadcast) in ./rehydrateRooms
//   - roomActors Map in ./roomService
// - You have mongoose connection bootstrap elsewhere or here.
//
// Message contract (suggested):
// Client -> Server
//   { type: 'CREATE_ROOM', room: Room }
//   { type: 'JOIN_ROOM', roomId: string, userId?: string }
//   { type: 'LEAVE_ROOM', roomId: string }
//   { type: 'ROOM_EVENT', roomId: string, event: RoomEvents }
// Server -> Client
//   { type: 'ROOM_SNAPSHOT', roomId: string, snapshot: { value: any, context: any } }
//   { type: 'ERROR', requestId?: string, message: string }
//   { type: 'JOINED_ROOM', roomId: string }
//
// You can add requestId correlation as needed.

import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';
import mongoose from 'mongoose';

import { createRoomActor, roomActors } from './roomService';
import { rehydrateAllRooms } from './rehydrateRooms';

type WsClient = WebSocket & { id?: string };

type Incoming =
    | { type: 'CREATE_ROOM'; room: Room; requestId?: string }
    | { type: 'JOIN_ROOM'; roomId: string; userId?: string; requestId?: string }
    | { type: 'LEAVE_ROOM'; roomId: string; requestId?: string }
    | { type: 'ROOM_EVENT'; roomId: string; event: RoomEvents; requestId?: string };

type Outgoing =
    | { type: 'ROOM_SNAPSHOT'; roomId: string; snapshot: { value: any; context: any } }
    | { type: 'JOINED_ROOM'; roomId: string }
    | { type: 'ERROR'; requestId?: string; message: string };

// ---- in-memory subscriptions: roomId -> ws clients
const roomSubscribers = new Map<string, Set<WsClient>>();

function safeSend(ws: WsClient, msg: Outgoing) {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify(msg));
}

function broadcastToRoom(roomId: string, msg: Outgoing) {
    const subs = roomSubscribers.get(roomId);
    if (!subs) return;
    for (const ws of subs) safeSend(ws, msg);
}

function subscribe(ws: WsClient, roomId: string) {
    const subs = roomSubscribers.get(roomId) ?? new Set<WsClient>();
    subs.add(ws);
    roomSubscribers.set(roomId, subs);
}

function unsubscribe(ws: WsClient, roomId: string) {
    const subs = roomSubscribers.get(roomId);
    if (!subs) return;
    subs.delete(ws);
    if (subs.size === 0) roomSubscribers.delete(roomId);
}

function unsubscribeAll(ws: WsClient) {
    for (const [roomId, subs] of roomSubscribers) {
        if (subs.has(ws)) subs.delete(ws);
        if (subs.size === 0) roomSubscribers.delete(roomId);
    }
}

function parseIncoming(raw: WebSocket.RawData): Incoming {
    const text = typeof raw === 'string' ? raw : raw.toString('utf8');
    const msg = JSON.parse(text);
    return msg as Incoming;
}

export async function startWsServer(opts: { port: number; mongoUri: string; dbName?: string }) {
    const { port, mongoUri, dbName = 'clocktower' } = opts;

    // ---- DB connection (server-only; UI never reads Mongo)
    await mongoose.connect(mongoUri, { dbName });

    const server = http.createServer();

    const wss = new WebSocketServer({ server });

    // ---- Room actor broadcast hook (RoomService uses this)
    const broadcast = (msg: unknown) => {
        // We only care about ROOM_SNAPSHOT shape here.
        // Your roomService should broadcast snapshots using:
        // { type:'ROOM_SNAPSHOT', roomId, snapshot:{ value, context } }
        const m = msg as any;
        if (m?.type === 'ROOM_SNAPSHOT' && typeof m.roomId === 'string') {
            broadcastToRoom(m.roomId, m as Outgoing);
        } else {
            // optionally: global broadcast or ignore
        }
    };

    // ---- Rehydrate all rooms (so "backup" is real)
    await rehydrateAllRooms(broadcast);

    wss.on('connection', (ws: WsClient) => {
        ws.on('message', (raw) => {
            let msg: Incoming;
            try {
                msg = parseIncoming(raw);
            } catch (e) {
                safeSend(ws, { type: 'ERROR', message: 'Invalid JSON message' });
                return;
            }

            switch (msg.type) {
                case 'CREATE_ROOM': {
                    try {
                        const room = msg.room;

                        // create actor in-memory + start persisting + broadcasting
                        const actor = createRoomActor(room, broadcast);

                        // auto-subscribe creator to the room
                        subscribe(ws, room._id);

                        // send joined ack + immediate snapshot
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

                    subscribe(ws, roomId);
                    safeSend(ws, { type: 'JOINED_ROOM', roomId });

                    // send current snapshot immediately
                    const snap = actor.getSnapshot();
                    safeSend(ws, {
                        type: 'ROOM_SNAPSHOT',
                        roomId,
                        snapshot: { value: snap.value, context: snap.context }
                    });
                    return;
                }

                case 'LEAVE_ROOM': {
                    unsubscribe(ws, msg.roomId);
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

                    // Forward event into RoomMachine actor
                    // (RoomMachine will broadcast snapshots via subscription in roomService)
                    actor.send(msg.event);
                    return;
                }

                default: {
                    safeSend(ws, { type: 'ERROR', requestId: (msg as any).requestId, message: 'Unknown message type' });
                    return;
                }
            }
        });

        ws.on('close', () => {
            unsubscribeAll(ws);
        });

        ws.on('error', () => {
            unsubscribeAll(ws);
        });
    });

    server.listen(port);
    return { server, wss };
}
