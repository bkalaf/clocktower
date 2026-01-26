// src/server/realtime/socketServer.ts
import http from 'node:http';

import mongoose from 'mongoose';
import { createActor } from 'xstate';
import { Server, type ServerOptions, type Socket } from 'socket.io';

import { roomActors } from '../roomService';
import { rehydrateAllRooms } from '../rehydrateRooms';
import { getRoomSummaries } from './roomList';
import { SessionMachine } from '../machines/SessionMachine';
import type { IncomingMessage, OutgoingMessage, SessionStateValue } from '@/shared/realtime/messages';

const roomSubscribers = new Map<string, Set<Socket>>();
const connectedClients = new Set<Socket>();

function broadcastToRoom(roomId: string, msg: OutgoingMessage) {
    const subs = roomSubscribers.get(roomId);
    if (!subs) return;
    for (const socket of subs) {
        socket.emit('message', msg);
    }
}

function subscribe(roomId: string, socket: Socket) {
    const subs = roomSubscribers.get(roomId) ?? new Set<Socket>();
    subs.add(socket);
    roomSubscribers.set(roomId, subs);
}

function unsubscribe(roomId: string, socket: Socket) {
    const subs = roomSubscribers.get(roomId);
    if (!subs) return;
    subs.delete(socket);
    if (subs.size === 0) {
        roomSubscribers.delete(roomId);
    }
}

function unsubscribeAll(socket: Socket) {
    for (const [roomId, subs] of roomSubscribers) {
        if (subs.has(socket)) {
            subs.delete(socket);
        }
        if (subs.size === 0) {
            roomSubscribers.delete(roomId);
        }
    }
}

function broadcastRoomsList(rooms: RoomSummary[]) {
    if (rooms.length === 0 && connectedClients.size === 0) return;
    const msg: OutgoingMessage = { type: 'ROOMS_LIST', rooms };
    for (const client of connectedClients) {
        client.emit('message', msg);
    }
}

function broadcast(msg: unknown) {
    const candidate = msg as OutgoingMessage;
    if (candidate?.type === 'ROOM_SNAPSHOT' && typeof candidate.roomId === 'string') {
        broadcastToRoom(candidate.roomId, candidate);
    }
}

async function sendRoomsList(socket: Socket, requestId?: string) {
    try {
        const rooms = await getRoomSummaries();
        const msg: OutgoingMessage = {
            type: 'ROOMS_LIST',
            rooms,
            requestId
        };
        socket.emit('message', msg);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch rooms';
        socket.emit('message', { type: 'ERROR', requestId, message });
    }
}

function handleIncomingMessage(socket: Socket, sessionService: ReturnType<typeof createActor>) {
    const sendMessage = (msg: OutgoingMessage) => socket.emit('message', msg);

    return (rawMessage: unknown) => {
        if (!rawMessage || typeof rawMessage !== 'object') {
            sendMessage({ type: 'ERROR', message: 'Invalid realtime payload' });
            return;
        }

        const message = rawMessage as IncomingMessage;
        switch (message.type) {
            case 'CREATE_ROOM': {
                sessionService.send({
                    type: 'CREATE_ROOM',
                    room: message.room,
                    requestId: message.requestId
                });
                return;
            }

            // case 'LOGIN_SUCCESS': {
            //     sessionService.send({ type: 'LOGIN_SUCCESS', userId: message.userId, username: message.username });
            //     return;
            // }

            case 'JOIN_ROOM': {
                const actor = roomActors.get(message.roomId);
                if (!actor) {
                    sendMessage({
                        type: 'ERROR',
                        requestId: message.requestId,
                        message: `Room not found: ${message.roomId}`
                    });
                    return;
                }

                subscribe(message.roomId, socket);
                sendMessage({ type: 'JOINED_ROOM', roomId: message.roomId });

                const snapshot = actor.getSnapshot();
                sendMessage({
                    type: 'ROOM_SNAPSHOT',
                    roomId: message.roomId,
                    snapshot: { value: snapshot.value, context: snapshot.context }
                });

                sessionService.send({ type: 'ENTER_ROOM', roomId: message.roomId });
                return;
            }

            case 'LEAVE_ROOM': {
                unsubscribe(message.roomId, socket);
                sessionService.send({ type: 'LEAVE_ROOM' });
                return;
            }

            case 'ROOM_EVENT': {
                const actor = roomActors.get(message.roomId);
                if (!actor) {
                    sendMessage({
                        type: 'ERROR',
                        requestId: message.requestId,
                        message: `Room not found: ${message.roomId}`
                    });
                    return;
                }

                actor.send(message.event);
                return;
            }

            case 'LIST_ROOMS': {
                void sendRoomsList(socket, message.requestId);
                return;
            }

            default: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sendMessage({
                    type: 'ERROR',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    requestId: (message as any).requestId,
                    message: 'Unknown message type'
                });
                return;
            }
        }
    };
}

function setupConnection(socket: Socket) {
    connectedClients.add(socket);

    const sessionService = createActor(SessionMachine, {
        input: {
            ws: socket,
            subscribe,
            unsubscribe,
            unsubscribeAll,
            broadcast,
            listRooms: getRoomSummaries,
            broadcastRoomsList,
            send: (msg: OutgoingMessage) => socket.emit('message', msg)
        }
    });
    sessionService.start();

    const sessionSubscription = sessionService.subscribe((state) => {
        socket.emit('message', {
            type: 'SESSION_SNAPSHOT',
            snapshot: {
                value: state.value as SessionStateValue,
                context: state.context
            }
        });
    });

    const handleMessage = handleIncomingMessage(socket, sessionService);

    let cleanedUp = false;
    const teardown = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        sessionSubscription.unsubscribe();
        sessionService.stop();
        unsubscribeAll(socket);
        connectedClients.delete(socket);
        socket.off('message', handleMessage);
        socket.off('disconnect', teardown);
        socket.off('error', teardown);
    };

    socket.on('message', handleMessage);
    socket.on('disconnect', teardown);
    socket.on('error', teardown);
}

export type AttachSocketIoOptions = {
    httpServer: http.Server;
    mongoUri: string;
    dbName?: string;
    cors?: ServerOptions['cors'];
};

export async function attachSocketIoToHttpServer(opts: AttachSocketIoOptions) {
    const { httpServer, mongoUri, dbName = 'clocktower', cors } = opts;

    await mongoose.connect(mongoUri, { dbName });

    const io = new Server(httpServer, {
        path: '/socket.io',
        cors: cors ?? { origin: true, methods: ['GET', 'POST'], credentials: true }
    });

    await rehydrateAllRooms(broadcast);

    io.on('connection', setupConnection);

    return { io };
}

export async function startSocketIoStandalone(opts: { port: number; mongoUri: string; dbName?: string }) {
    const { port, mongoUri, dbName } = opts;
    const server = http.createServer();
    const { io } = await attachSocketIoToHttpServer({
        httpServer: server,
        mongoUri,
        dbName,
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    await new Promise<void>((resolve, reject) => {
        server.listen(port, () => resolve());
        server.once('error', (error) => reject(error));
    });

    return { server, io };
}
