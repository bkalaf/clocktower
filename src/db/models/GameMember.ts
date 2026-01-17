// src/db/models/GameMember.ts
import mongoose from 'mongoose';
import { zGameRoles } from '../../schemas';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';

const zUpdateGameMember = z.object({
    role: zGameRoles.default('spectator'),
    isSeated: z.boolean().default(false)
});

export const zGameMember = z.object({
    _id: z.uuid('Must be a UUID'),
    gameId: z.uuid('Must be a UUID'),
    userId: z.uuid('Must be a UUID'),
    joinedAt: z.date(),
    ...zUpdateGameMember.shape
});

const gameMemberModels = getTypesFor(
    'GameMember',
    zGameMember,
    { timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' }, collection: 'game_member' },
    { update: zUpdateGameMember },
    [{ gameId: 1, userId: 1 }, { unique: true }],
    [{ gameId: 1, role: 1 }]
);
export default gameMemberModels;
export type GameMember = z.infer<typeof zGameMember>;
export type GameMemberType = mongoose.InferRawDocType<GameMember>;
export type GameMemberDocument = mongoose.HydratedDocument<GameMemberType>;
export const GameMemberModel = gameMemberModels.model;
