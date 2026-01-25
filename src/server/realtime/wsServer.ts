// src/server/realtime/wsServer.ts
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
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';

import { createWsConnection, type WsClient } from './wsConnection';
import { getRoomSummaries } from './roomList';
import type { OutgoingMessage } from '@/shared/realtime/messages';
import { RoomsListMessage } from '@/shared/realtime/messages';
import { rehydrateAllRooms } from '../rehydrateRooms';

// ---- in-memory subscriptions: roomId -> ws clients
const roomSubscribers = new Map<string, Set<WsClient>>();
const connectedClients = new Set<WsClient>();

function safeSend(ws: WsClient, msg: OutgoingMessage) {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify(msg));
}

function broadcastToRoom(roomId: string, msg: OutgoingMessage) {
    const subs = roomSubscribers.get(roomId);
    if (!subs) return;
    for (const ws of subs) safeSend(ws, msg);
}

function subscribe(roomId: string, ws: WsClient) {
    const subs = roomSubscribers.get(roomId) ?? new Set<WsClient>();
    subs.add(ws);
    roomSubscribers.set(roomId, subs);
}

function unsubscribe(roomId: string, ws: WsClient) {
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

function broadcastRoomsList(rooms: RoomSummary[]) {
    if (rooms.length === 0 && connectedClients.size === 0) return;
    const msg: RoomsListMessage = { type: 'ROOMS_LIST', rooms };
    for (const client of connectedClients) {
        safeSend(client, msg);
    }
}

export async function startWsServer(opts: { port: number; mongoUri: string; dbName?: string }) {
    const { port, mongoUri, dbName = 'clocktower' } = opts;

    // ---- DB connection (server-only; UI never reads Mongo)
    await mongoose.connect(mongoUri, { dbName });
    let server: http.Server | undefined;
    let wss: WebSocketServer | undefined;
    try {
        server = http.createServer();

        wss = new WebSocketServer({ server });
    } catch (error) {
        console.log(`error`, (error as Error).message);
        throw error;
    }

    // ---- Room actor broadcast hook (RoomService uses this)
    const broadcast = (msg: unknown) => {
        // We only care about ROOM_SNAPSHOT shape here.
        // Your roomService should broadcast snapshots using:
        // { type:'ROOM_SNAPSHOT', roomId, snapshot:{ value, context } }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const m = msg as any;
        if (m?.type === 'ROOM_SNAPSHOT' && typeof m.roomId === 'string') {
            broadcastToRoom(m.roomId, m as OutgoingMessage);
        } else {
            // optionally: global broadcast or ignore
        }
    };

    // ---- Rehydrate all rooms (so "backup" is real)
    await rehydrateAllRooms(broadcast);

    wss.on('connection', (ws: WsClient) => {
        connectedClients.add(ws);
        const removeClient = () => {
            connectedClients.delete(ws);
        };
        ws.on('close', removeClient);
        ws.on('error', removeClient);

        createWsConnection({
            ws,
            subscribe,
            unsubscribe,
            unsubscribeAll,
            broadcast,
            listRooms: getRoomSummaries,
            broadcastRoomsList
        });
    });

    server.listen(port);
    return { server, wss };
}
