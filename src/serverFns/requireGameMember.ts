// src/serverFns/requireGameMember.ts
import { connectMongoose } from '../db/connectMongoose';
import $gameMember from './$gameMember';
import { createServerFn } from '@tanstack/react-start';
import { zRequireGameMemberInput } from '../schemas';

export const requireGameMember = createServerFn({
    method: 'GET'
})
    .inputValidator(zRequireGameMemberInput)
    .handler(async ({ data }) => {
        await connectMongoose();
        const member = await $gameMember.findOne(data.gameId, data.user);
        if (member) {
            return {
                role: member.role,
                userId: member.userId
            };
        }
        return null;
    });
