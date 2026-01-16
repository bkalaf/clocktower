// src/redis/index.ts
import { createClient } from 'redis';
import { env } from '../env';

let client: ReturnType<typeof createClient> | null = null;
let ready = false;

export async function getRedis(): Promise<ReturnType<typeof createClient>> {
    if (!client) {
        client = createClient({ url: env.REDIS_URL });
    }
    if (!ready) {
        await client.connect();
        ready = true;
    }
    return client;
}
