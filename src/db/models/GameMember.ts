// src/db/models/GameMember.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { refs, aliases, enums } = schemas;

const zUpdateGameMember = z.object({
    role: enums.sessionRoles.default('spectator'),
    isSeated: z.boolean().default(false)
});

export const zGameMember = z.object({
    _id: aliases.gameMemberId,
    gameId: refs.game,
    userId: refs.user,
    joinedAt: z.date(),
    ...zUpdateGameMember.shape
});

const gameMemberModels = getTypesFor(
    'game_member',
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
