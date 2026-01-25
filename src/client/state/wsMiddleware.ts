// src/client/state/wsMiddleware.ts
import { createAction, type Middleware, type Dispatch } from '@reduxjs/toolkit';
import type { IncomingMessage, OutgoingMessage } from '@/shared/realtime/messages';
import { realtimeActions, realtimeSelectors } from './realtimeSlice';
import { authActions } from './authSlice';

type PendingRequest = {
    resolve: (value: RoomSummary) => void;
    reject: (error: Error) => void;
};

const pendingRequests = new Map<string, PendingRequest>();

function createRequestId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function resolveRequest(requestId: string, value: RoomSummary) {
    const entry = pendingRequests.get(requestId);
    if (!entry) return;
    entry.resolve(value);
    pendingRequests.delete(requestId);
}

function rejectRequest(requestId: string, error: Error) {
    const entry = pendingRequests.get(requestId);
    if (!entry) return;
    entry.reject(error);
    pendingRequests.delete(requestId);
}

function rejectAllPending(error: Error) {
    for (const entry of pendingRequests.values()) {
        entry.reject(error);
    }
    pendingRequests.clear();
}

export const wsConnect = createAction<{ url: string }>('ws/connect');
export const wsDisconnect = createAction('ws/disconnect');
export const wsSend = createAction<IncomingMessage>('ws/send');

export function sendCreateRoom(dispatch: Dispatch, room: Room) {
    const requestId = createRequestId();
    return new Promise<RoomSummary>((resolve, reject) => {
        pendingRequests.set(requestId, { resolve, reject });
        dispatch(
            wsSend({
                type: 'CREATE_ROOM',
                room,
                requestId
            })
        );
    });
}

export function requestRoomsList(dispatch: Dispatch) {
    dispatch(wsSend({ type: 'LIST_ROOMS' }));
}

const wsMiddleware: Middleware = (store) => {
    console.log(`in wsMiddleware`);
    let socket: WebSocket | null = null;
    let cleanup: (() => void) | null = null;
    let lastLoginPayload: { userId?: string; username?: string } | null = null;

    const handleMessage = (raw: string) => {
        console.log(`raw message: `, raw);
        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            store.dispatch(realtimeActions.setLastError('Received invalid realtime payload'));
            return;
        }

        if (!parsed || typeof parsed !== 'object' || typeof (parsed as { type?: unknown }).type !== 'string') {
            store.dispatch(realtimeActions.setLastError('Received malformed realtime payload'));
            return;
        }

        const message = parsed as OutgoingMessage;
        switch (message.type) {
            case 'ROOMS_LIST':
                const roomsList = realtimeSelectors.selectRoomsList(store.getState());
                if (roomsList.length === message.rooms.length) break;
                store.dispatch(realtimeActions.setRooms(message.rooms));
                break;
            case 'ROOM_CREATED': {
                store.dispatch(realtimeActions.upsertRoom(message.room));
                if (message.requestId) {
                    resolveRequest(message.requestId, message.room);
                }
                break;
            }
            case 'ROOM_SNAPSHOT':
                store.dispatch(
                    realtimeActions.setSnapshot({
                        roomId: message.roomId,
                        snapshot: message.snapshot
                    })
                );
                break;
            case 'SESSION_SNAPSHOT': {
                store.dispatch(
                    realtimeActions.setSessionSnapshot({
                        value: message.snapshot.value,
                        context: message.snapshot.context
                    })
                );
                break;
            }
            case 'JOINED_ROOM':
                store.dispatch(realtimeActions.setCurrentRoomId(message.roomId));
                break;
            case 'ERROR':
                store.dispatch(realtimeActions.setLastError(message.message));
                if (message.requestId) {
                    rejectRequest(message.requestId, new Error(message.message));
                }
                break;
            default:
                break;
        }
    };

    const connectSocket = (url: string) => {
        if (socket) {
            cleanup?.();
            socket.close();
            socket = null;
        }

        socket = new WebSocket(url);
        store.dispatch(realtimeActions.setStatus('connecting'));

        const handleOpen = () => {
            store.dispatch(realtimeActions.setStatus('connected'));
            if (lastLoginPayload) {
                store.dispatch(
                    wsSend({
                        type: 'LOGIN_SUCCESS',
                        userId: lastLoginPayload.userId ?? '',
                        username: lastLoginPayload.username ?? ''
                    })
                );
            }
        };
        const handleClose = () => {
            store.dispatch(realtimeActions.setStatus('disconnected'));
            rejectAllPending(new Error('Realtime connection closed'));
        };
        const handleError = () => {
            store.dispatch(realtimeActions.setStatus('disconnected'));
            rejectAllPending(new Error('Realtime connection error'));
        };
        const handleIncoming = (event: MessageEvent<string>) => {
            handleMessage(event.data);
        };

        socket.addEventListener('open', handleOpen);
        socket.addEventListener('close', handleClose);
        socket.addEventListener('error', handleError);
        socket.addEventListener('message', handleIncoming);

        cleanup = () => {
            socket?.removeEventListener('open', handleOpen);
            socket?.removeEventListener('close', handleClose);
            socket?.removeEventListener('error', handleError);
            socket?.removeEventListener('message', handleIncoming);
        };
    };

    const disconnectSocket = () => {
        if (socket) {
            cleanup?.();
            socket.close();
            socket = null;
            cleanup = null;
        }
        store.dispatch(realtimeActions.setStatus('disconnected'));
        rejectAllPending(new Error('Realtime connection disconnected'));
    };

    return (next) => (action) => {
        if (authActions.login.match(action)) {
            console.log(`ws.url`);
            lastLoginPayload = action.payload;
            connectSocket('ws://localhost:3001/ws');
        } else if (authActions.logout.match(action)) {
            lastLoginPayload = null;
            disconnectSocket();
        } else if (wsConnect.match(action)) {
            connectSocket(action.payload.url);
        } else if (wsDisconnect.match(action)) {
            disconnectSocket();
        } else if (wsSend.match(action)) {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                store.dispatch(realtimeActions.setLastError('Realtime socket is not connected'));
                if (action.payload.requestId) {
                    rejectRequest(action.payload.requestId, new Error('Realtime socket is not connected'));
                }
            } else {
                socket.send(JSON.stringify(action.payload));
            }
        }
        return next(action);
    };
};

export default wsMiddleware;
