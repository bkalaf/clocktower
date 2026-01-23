// src/lib/realtime.ts
export function getRealtimeUrl() {
    if (typeof window === 'undefined') {
        return '';
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = import.meta.env.VITE_REALTIME_HOST ?? window.location.hostname;
    const port = import.meta.env.VITE_REALTIME_PORT ?? window.location.port;
    const portSegment = port ? `:${port}` : '';
    return `${protocol}://${host}${portSegment}/ws`;
}
