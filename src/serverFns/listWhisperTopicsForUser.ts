// src/serverFns/listWhisperTopicsForUser.ts
import { createServerFn } from '@tanstack/react-start';
import { $keys } from '../keys';
import { connectMongoose } from '../db/connectMongoose';
import { getRedis } from '../redis';
import { GameId, UserId, GameRoles } from '../types/game';
import { listWhisperTopicsInput } from '../utils/http';
import $whisper from './whisper';

const toRoomTopic = (topic: string) => (topic.startsWith('game:') ? topic.replace(/^game:/, 'room:') : topic);

type ListWhisperTopicsRequest = {
    gameId: GameId;
    userId: UserId;
    role: GameRoles;
};

export const listWhisperTopicsForUser = createServerFn<'POST', string[]>({
    method: 'POST'
})
    .inputValidator(listWhisperTopicsInput)
    .handler(async ({ data }: { data: ListWhisperTopicsRequest }) => {
        const r = await getRedis();
        const key = $keys.userWhisperKey(data.gameId, data.userId);
        const topics = await r.sMembers(key);
        if (topics.length === 0) {
            await connectMongoose();
            const whispers = await $whisper.find(data.gameId, data.userId, true);

            topics.push(...whispers.map((whisper) => whisper.topicId));

            for (const whisper of whispers) {
                await r.sAdd($keys.whisperMembersKey(data.gameId, whisper._id), whisper.members);
                for (const member of whisper.members) {
                    await r.sAdd($keys.userWhisperKey(data.gameId, member), whisper.topicId);
                    await r.sAdd($keys.userWhisperKey(data.gameId, member), toRoomTopic(whisper.topicId));
                }
            }
        }
        const normalized = new Set<string>();

        for (const topic of topics) {
            normalized.add(topic);
            normalized.add(toRoomTopic(topic));
        }
        return Array.from(normalized);
    });
