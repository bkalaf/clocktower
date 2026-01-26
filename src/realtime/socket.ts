// src/realtime/socket.ts
import { io, type Socket } from 'socket.io-client';

const SOCKET_PATH = '/socket.io';
const SOCKET_TRANSPORTS = ['websocket'];

let socket: Socket | null = null;
let resolvedUrl: string | undefined;

export function getRealtimeSocketUrl(override?: string) {
    if (override) return override;
    const envUrl = import.meta.env.VITE_REALTIME_URL;
    if (typeof envUrl === 'string' && envUrl.length > 0) {
        return envUrl;
    }
    if (typeof window === 'undefined') {
        return undefined;
    }
    return '';
}

export function getRealtimeSocket(url?: string) {
    const endpoint = getRealtimeSocketUrl(url);
    const normalizedEndpoint = endpoint === '' ? undefined : endpoint;
    if (socket && resolvedUrl === normalizedEndpoint) {
        return socket;
    }

    socket?.disconnect();
    socket = io(normalizedEndpoint, {
        path: SOCKET_PATH,
        transports: SOCKET_TRANSPORTS,
        withCredentials: true,
        autoConnect: false
    });
    resolvedUrl = normalizedEndpoint;
    return socket;
}

export function resetRealtimeSocket() {
    socket?.disconnect();
    socket = null;
    resolvedUrl = undefined;
}
