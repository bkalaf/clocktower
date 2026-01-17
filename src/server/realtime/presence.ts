// src/server/realtime/presence.ts
import { $keys } from '../../$keys';
import { getRedis } from '../../redis';

export async function markConnected(gameId: string, userId: string) {
    const r = await getRedis();
    await r.sAdd($keys.presenceKey(gameId), userId);
}

export async function markDisconnected(gameId: string, userId: string) {
    const r = await getRedis();
    await r.sRem($keys.presenceKey(gameId), userId);
}

export async function getConnectedUserIds(gameId: string): Promise<string[]> {
    const r = await getRedis();
    return r.sMembers($keys.presenceKey(gameId));
}

export async function connectedCount(gameId: string): Promise<number> {
    const r = await getRedis();
    return r.sCard($keys.presenceKey(gameId));
}
