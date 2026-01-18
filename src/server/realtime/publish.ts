// src/server/realtime/publish.ts
import { randomUUID } from 'crypto';
import { AppEvents, StreamId } from '../../types/game';
import { ChatItemModel } from '@/db/models/ChatItem';
import { StreamMessageModel } from '@/db/models/StreamMessage';
import { connectMongoose } from '../../db/connectMongoose';
import { getRedis } from '../../redis';

const GAME_TOPIC_PREFIX = 'game:';

function getGameIdFromTopic(topic: string): string | null {
    if (!topic.startsWith(GAME_TOPIC_PREFIX)) return null;
    const parts = topic.split(':');
    if (parts.length < 3) return null;
    return parts[1];
}

function toDate(value: number | Date): Date {
    if (value instanceof Date) return value;
    return new Date(value);
}

export async function publish(
    topic: string,
    msg: AppEvents
): Promise<AppEvents & { streamId: StreamId }> {
    const streamId = randomUUID();
    const ts = typeof msg.ts === 'number' ? msg.ts : Date.now();
    const published = { ...msg, ts, streamId };

    const gameId = getGameIdFromTopic(topic);
    if (!gameId) {
        throw new Error(`Unable to derive gameId from topic "${topic}"`);
    }

    await connectMongoose();
    if (published.kind === 'chat') {
        await ChatItemModel.create({
            _id: published.id,
            gameId,
            topicId: topic,
            text: published.text,
            ts: toDate(published.ts),
            streamId,
            from: published.from
        });
    } else {
        await StreamMessageModel.create({
            _id: randomUUID(),
            gameId,
            topicId: topic,
            streamId,
            ts: toDate(published.ts),
            kind: published.kind,
            message: published
        });
    }

    const redis = await getRedis();
    await redis.publish(topic, JSON.stringify(published));
    return published;
}
