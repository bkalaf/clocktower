// src/server/realtime/wsServer.ts
import http from 'node:http';
import { IncomingMessage } from 'node:http';
import { WebSocketServer } from 'ws';
import { env } from '../../env';
import { publish } from './publish';
import { handleWsConnection } from './wsConnection';

let startPromise: Promise<void> | null = null;

function createRequestFromIncoming(req: IncomingMessage) {
    const secure = Boolean(req.socket && 'encrypted' in req.socket && req.socket.encrypted);
    const host = req.headers.host ?? `localhost:${env.REALTIME_PORT}`;
    const url = new URL(req.url ?? '/', `${secure ? 'https' : 'http'}://${host}`);
    const headers: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(req.headers)) {
        if (value == null) continue;
        headers[key] = value;
    }
    return new Request(url.toString(), {
        headers,
        method: req.method ?? 'GET'
    });
}

export function startRealtimeServer() {
    if (startPromise) return startPromise;
    const port = env.REALTIME_PORT;
    if (port <= 0) {
        return (startPromise = Promise.resolve());
    }

    startPromise = new Promise((resolve, reject) => {
        const server = http.createServer();
        const wss = new WebSocketServer({ noServer: true });

        wss.on('connection', (ws, request) => {
            if (!request) {
                ws.close();
                return;
            }
            handleWsConnection(ws, createRequestFromIncoming(request), publish).catch((error) => {
                console.error('[realtime] connection error', error);
                if (ws.readyState === ws.OPEN) {
                    ws.close();
                }
            });
        });

        server.on('upgrade', (request, socket, head) => {
            const handlerUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
            if (handlerUrl.pathname !== '/ws') {
                socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                socket.destroy();
                return;
            }
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit('connection', ws, request);
            });
        });

        server.on('error', (error) => {
            reject(error);
        });

        server.listen(port, () => {
            console.log(`[realtime] listening on ws://localhost:${port}/ws`);
            resolve();
        });
    });

    return startPromise;
}

startRealtimeServer().catch((error) => {
    console.error('[realtime] failed to start websocket server', error);
});
