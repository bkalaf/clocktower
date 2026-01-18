// src/server/whisper/createWhisper.ts
import { randomUUID } from 'crypto';
import { connectMongoose } from '../../db/connectMongoose';
import { WhisperModel } from '@/db/models/Whisper';
import { getRedis } from '../../redis';
import { $keys } from '../../$keys';
import { GameId, TopicId, UserId } from '../../types/game';

export interface CreateWhisperInput {
    gameId: GameId;
    creator: UserId;
    members: UserId[];
    name?: string | null;
    includeStoryteller: boolean;
}

export async function createWhisper(input: CreateWhisperInput) {
    await connectMongoose();

    const whisperId = randomUUID();
    const topicId = `game:${input.gameId}:whisper:${whisperId}` as TopicId;
    const members = Array.from(new Set(input.members));
    const meta: { includeStoryteller: boolean; name?: string } = {
        includeStoryteller: input.includeStoryteller
    };
    if (typeof input.name === 'string' && input.name.length > 0) {
        meta.name = input.name;
    }

    const doc = await WhisperModel.create({
        _id: whisperId,
        gameId: input.gameId,
        topicId,
        creator: input.creator,
        members,
        isActive: true,
        meta
    });

    const redis = await getRedis();
    if (members.length > 0) {
        const roomTopic = topicId.startsWith('game:') ? topicId.replace(/^game:/, 'room:') : topicId;
        await redis.sAdd($keys.whisperMembersKey(input.gameId, whisperId), members);
        await Promise.all(
            members.map((member) => redis.sAdd($keys.userWhisperKey(input.gameId, member), topicId, roomTopic))
        );
    }

    return doc;
}
