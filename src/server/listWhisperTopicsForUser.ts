// src/server/listWhisperTopicsForUser.ts
import { createServerFn } from '@tanstack/react-start';
import { $keys } from '../$keys';
import { connectMongoose } from '../db/connectMongoose';
import { WhisperModel } from '../db/models/whisper';
import { getRedis } from '../redis';
import { GameId, UserId, GameRoles } from '../types/game';
import { listWhisperTopicsInput } from '../utils/http';
import z from 'zod';

export const listWhisperTopicsForUser = createServerFn({
    method: 'POST'
})
    .inputValidator((data: z.infer<typeof listWhisperTopicsInput>) => listWhisperTopicsInput.parse(data))
    .handler(async ({ data }: { data: { gameId: GameId; userId: UserId; role: GameRoles } }) => {
        const r = await getRedis();
        const key = $keys.userWhisperKey(data.gameId, data.userId);
        const topics = await r.sMembers(key);
        if (topics.length === 0) {
            await connectMongoose();
            const query =
                data.role === 'storyteller' ?
                    { gameId: data.gameId, isActive: true }
                :   { gameId: data.gameId, isActive: true, members: data.userId };

            const whispers = await WhisperModel.find(query).lean();

            topics.push(...whispers.map((whisper) => whisper.topicId));

            for (const whisper of whispers) {
                await r.sAdd($keys.whisperMembersKey(data.gameId, whisper._id), whisper.members);
                for (const member of whisper.members) {
                    await r.sAdd($keys.userWhisperKey(data.gameId, member), whisper.topicId);
                }
            }
        }
        return topics;
    });
