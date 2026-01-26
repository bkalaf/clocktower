import { createAction, type Middleware, type Dispatch } from '@reduxjs/toolkit';
import type { IncomingMessage, OutgoingMessage } from '@/shared/realtime/messages';
import { realtimeActions, realtimeSelectors } from './realtimeSlice';
import { getRealtimeSocket, resetRealtimeSocket } from '@/realtime/socket';

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

export const wsConnect = createAction<{ url?: string }>('ws/connect');
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
    let socket: ReturnType<typeof getRealtimeSocket> | null = null;
    let cleanup: (() => void) | null = null;

    const handleMessage = (raw: unknown) => {
        let parsed: unknown = raw;
        if (typeof raw === 'string') {
            try {
                parsed = JSON.parse(raw);
            } catch {
                store.dispatch(realtimeActions.setLastError('Received invalid realtime payload'));
                return;
            }
        }

        if (!parsed || typeof parsed !== 'object' || typeof (parsed as { type?: unknown }).type !== 'string') {
            store.dispatch(realtimeActions.setLastError('Received malformed realtime payload'));
            return;
        }

        const message = parsed as OutgoingMessage;
        switch (message.type) {
            case 'ROOMS_LIST': {
                const roomsList = realtimeSelectors.selectRoomsList(store.getState());
                if (roomsList.length === message.rooms.length) break;
                store.dispatch(realtimeActions.setRooms(message.rooms));
                break;
            }
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
            case 'SESSION_SNAPSHOT':
                store.dispatch(
                    realtimeActions.setSessionSnapshot({
                        value: message.snapshot.value,
                        context: message.snapshot.context
                    })
                );
                break;
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

    const connectSocket = (url?: string) => {
        if (socket) {
            cleanup?.();
            socket.disconnect();
            socket = null;
            resetRealtimeSocket();
            cleanup = null;
        }

        socket = getRealtimeSocket(url);
        store.dispatch(realtimeActions.setStatus('connecting'));

        const handleOpen = () => store.dispatch(realtimeActions.setStatus('connected'));
        const handleClose = () => {
            store.dispatch(realtimeActions.setStatus('disconnected'));
            rejectAllPending(new Error('Realtime connection closed'));
        };
        const handleError = () => {
            store.dispatch(realtimeActions.setStatus('disconnected'));
            rejectAllPending(new Error('Realtime connection error'));
        };
        const handleIncoming = (event: unknown) => {
            handleMessage(event);
        };

        socket.on('connect', handleOpen);
        socket.on('disconnect', handleClose);
        socket.on('error', handleError);
        socket.on('message', handleIncoming);
        socket.connect();

        cleanup = () => {
            socket?.off('connect', handleOpen);
            socket?.off('disconnect', handleClose);
            socket?.off('error', handleError);
            socket?.off('message', handleIncoming);
        };
    };

    const disconnectSocket = () => {
        if (!socket) return;
        cleanup?.();
        socket.disconnect();
        socket = null;
        resetRealtimeSocket();
        cleanup = null;
        store.dispatch(realtimeActions.setStatus('disconnected'));
        rejectAllPending(new Error('Realtime connection disconnected'));
    };

    return (next) => (action) => {
        if (wsConnect.match(action)) {
            connectSocket(action.payload.url);
        } else if (wsDisconnect.match(action)) {
            disconnectSocket();
        } else if (wsSend.match(action)) {
            if (!socket || !socket.connected) {
                store.dispatch(realtimeActions.setLastError('Realtime socket is not connected'));
                if (action.payload.requestId) {
                    rejectRequest(action.payload.requestId, new Error('Realtime socket is not connected'));
                }
            } else {
                socket.emit('message', action.payload);
            }
        }
        return next(action);
    };
};

export default wsMiddleware;
