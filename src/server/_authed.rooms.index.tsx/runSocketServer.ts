import { startSocketIoStandalone } from './socketServer';

const port = Number(process.env.REALTIME_PORT ?? process.env.VITE_REALTIME_PORT ?? 3001);
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB ?? 'clocktower';

const { server, io } = await startSocketIoStandalone({ port, mongoUri, dbName });

console.log(`[socket] realtime server running on http://localhost:${port}`);

const gracefulShutdown = () => {
    io.close();
    server.close(() => {
        process.exit(0);
    });
};

process.once('SIGINT', gracefulShutdown);
process.once('SIGTERM', gracefulShutdown);
process.once('uncaughtException', (error) => {
    console.error('Realtime server crashed', error);
    gracefulShutdown();
});
process.once('unhandledRejection', (error) => {
    console.error('Realtime server unhandled rejection', error);
    gracefulShutdown();
});
