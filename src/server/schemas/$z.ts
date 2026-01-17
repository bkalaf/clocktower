// src/server/schemas/$z.ts
import z from 'zod/v4';
import { zUserId, zGlobalRoles, zGameId, zGameRoles } from '../../schemas';
import mongoose, { Schema } from 'mongoose';
import { JSONSchema, jsonSchemaToMongoose } from '../../utils/jsonSchemaToMongoose';
import { getModelFor, getTypesFor } from '../../utils/zodToMongoose';
import { Game } from '../../types/game';

const zUpdateGameMember = z.object({
    role: zGameRoles.default('spectator'),
    isSeated: z.boolean().default(false)
});

const zGameMember = z.object({
    _id: z.uuid('Must be a UUID'),
    gameId: z.uuid('Must be a UUID'),
    userId: z.uuid('Must be a UUID'),
    joinedAt: z.date(),
    ...zUpdateGameMember.shape
});

const [GameMemberSchema, GameMemberModel] = getModelFor('GameMember', zGameMember, {
    timestamps: {
        createdAt: 'joinedAt',
        updatedAt: 'updatedAt'
    }
});

// export const $z = {
//     authUser: z.object({
//         _id: zUserId,
//         name: z.string().min(1, 'Name is required.'),
//         email: z.email('Invalid email.'),
//         userRoles: z.array(zGlobalRoles).min(1, 'User must have at least one role.')
//     }),
//     makeReadyInput: z.object({
//         isReady: z.boolean().default(false),
//         gameId: zGameId
//     }),
//     gameMember: {
//         type: zGameMember,
//         update: zUpdateGameMember
//     }
// };

export const $z = {
    zgameMember: {
        schema: GameMemberSchema,
        model: GameMemberModel,
        update: zUpdateGameMember,
        insert: zGameMember
    },
    gameMember: getTypesFor(
        'GameMember',
        zGameMember,
        { timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' } },
        { update: zUpdateGameMember }
    )
};
