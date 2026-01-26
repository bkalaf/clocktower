import type { ViteDevServer } from 'vite';

import http from 'node:http';
import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath, URL } from 'url';
import { attachSocketIoToHttpServer } from './src/server/_authed.rooms.index.tsx/socketServer';

import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

function realtimeDevPlugin() {
    let instance: Awaited<ReturnType<typeof attachSocketIoToHttpServer>> | null = null;
    let startPromise: Promise<void> | null = null;
    let registeredServer: http.Server | null = null;

    const stop = () => {
        if (!instance) return;
        instance.io.close();
        instance = null;
        startPromise = null;
        registeredServer = null;
    };

    const ensureStarted = async (server: ViteDevServer) => {
        if (instance) return;
        const httpServer = server.httpServer;
        if (!httpServer) {
            throw new Error('Vite dev server HTTP server is not available for realtime plugin');
        }
        const port = Number(process.env.REALTIME_PORT ?? process.env.VITE_REALTIME_PORT ?? 3001);
        const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
        const dbName = process.env.MONGODB_DB ?? 'clocktower';
        instance = await attachSocketIoToHttpServer({
            httpServer,
            mongoUri,
            dbName,
            cors: { origin: true, credentials: true, methods: ['GET', 'POST'] }
        });
        registerCloseHandler(httpServer);
    };

    const start = (server: ViteDevServer) => {
        if (instance) return Promise.resolve();
        if (startPromise) return startPromise;
        startPromise = ensureStarted(server).catch((error) => {
            console.error('Failed to initialize realtime Socket.IO server', error);
            instance = null;
            startPromise = null;
        });
        return startPromise;
    };

    const registerCloseHandler = (server: http.Server) => {
        if (registeredServer === server) return;
        registeredServer = server;
        server.once('close', () => {
            stop();
        });
    };

    return {
        name: 'clocktower-realtime-dev',
        configureServer(server: ViteDevServer) {
            void start(server);
        },
        configurePreviewServer(server: ViteDevServer) {
            void start(server);
        }
    };
}

const config = defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        exclude: ['@tanstack/start-client-core']
    },
    plugins: [
        devtools(),
        nitro(),
        realtimeDevPlugin(),
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ['./tsconfig.json']
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact()
    ]
});

export default config;
