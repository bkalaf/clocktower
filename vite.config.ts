import type { ViteDevServer } from 'vite';

import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import { fileURLToPath, URL } from 'url';
import { startWsServer } from './src/server/realtime/wsServer';

import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

function realtimeDevPlugin() {
    let instance: Awaited<ReturnType<typeof startWsServer>> | null = null;
    let startPromise: Promise<void> | null = null;

    const stop = () => {
        if (!instance) return;
        instance.wss.close();
        instance.server.close(() => {});
        instance = null;
        startPromise = null;
    };

    const ensureStarted = async () => {
        if (instance) return;
        const port = Number(process.env.REALTIME_PORT ?? process.env.VITE_REALTIME_PORT ?? 3001);
        const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
        const dbName = process.env.MONGODB_DB ?? 'clocktower';
        instance = await startWsServer({ port, mongoUri, dbName });
    };

    const start = () => {
        if (startPromise) return startPromise;
        startPromise = ensureStarted().catch((error) => {
            console.error('Failed to start realtime server', error);
            instance = null;
            startPromise = null;
        });
        return startPromise;
    };

    const registerCloseHandler = (server: ViteDevServer) => {
        const handler = () => {
            stop();
        };
        server.httpServer?.once('close', handler);
    };

    return {
        name: 'clocktower-realtime-dev',
        configureServer(server: ViteDevServer) {
            void start();
            registerCloseHandler(server);
        },
        configurePreviewServer(server: ViteDevServer) {
            void start();
            registerCloseHandler(server);
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
