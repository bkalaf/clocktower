// src/serverFns/require/requireGameMember.ts
import { connectMongoose } from '../../db/connectMongoose';
import $gameMember from '../$gameMember';
import { createServerFn } from '@tanstack/react-start';
import { GameMember } from '../../db/models/GameMember';
import inputs from '../../schemas/inputs';

export const requireGameMember = createServerFn({
    method: 'GET'
})
    .inputValidator(inputs.gameMember.find)
    .handler(async ({ data }) => {
        await connectMongoose();
        const member = (await $gameMember.findOne(data.gameId, data.user, { userId: 1, role: 1 })) as Pick<
            GameMember,
            'userId' | 'role'
        >;
        if (member) {
            return member;
        }
        throw new Error('could not find gameMember');
    });
