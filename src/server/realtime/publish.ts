// src/server/realtime/publish.ts
import { randomUUID } from 'crypto';
import { AppEvents, StreamId } from '../../types/game';
import { ChatItemModel } from '@/db/models/ChatItem';
import { StreamMessageModel } from '@/db/models/StreamMessage';
import { connectMongoose } from '../../db/connectMongoose';
import { getRedis } from '../../redis';
import { getMatchIdFromTopic, getRoomIdFromTopic, streamKeyForTopic, timestampFromStreamId } from './topicStreams';

function toDate(value: number | Date): Date {
    if (value instanceof Date) return value;
    return new Date(value);
}

export async function publish(
    topic: string,
    msg: AppEvents
): Promise<AppEvents & { streamId: StreamId; roomId: string; matchId: string | null }> {
    const roomId = getRoomIdFromTopic(topic);
    if (!roomId) {
        throw new Error(`Unable to derive roomId from topic "${topic}"`);
    }
    const matchId = getMatchIdFromTopic(topic);
    const redis = await getRedis();
    const streamKey = streamKeyForTopic(topic);
    const streamId = await redis.xAdd(streamKey, '*', { payload: JSON.stringify(msg) });
    const ts = timestampFromStreamId(streamId);
    const published = { ...msg, ts, streamId, roomId, matchId };

    await connectMongoose();
    if (published.kind === 'chat') {
        await ChatItemModel.create({
            _id: published.id,
            gameId: roomId,
            topicId: topic,
            text: published.text,
            ts: toDate(published.ts),
            streamId,
            from: published.from
        });
    } else {
        await StreamMessageModel.create({
            _id: randomUUID(),
            gameId: roomId,
            topicId: topic,
            streamId,
            ts: toDate(published.ts),
            kind: published.kind,
            message: published
        });
    }

    await redis.publish(topic, JSON.stringify(published));
    return published;
}
