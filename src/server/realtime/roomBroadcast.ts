// src/server/realtime/roomBroadcast.ts
import { getRedis } from '../../redis';
import { $keys } from '../../$keys';

export async function broadcastRoomEvent(roomId: string, payload: unknown) {
    const redis = await getRedis();
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await Promise.all([
        redis.publish($keys.publicTopic(roomId), message),
        redis.publish($keys.stTopic(roomId), message),
        redis.publish($keys.roomPublicTopic(roomId), message),
        redis.publish($keys.roomStTopic(roomId), message)
    ]);
}
