// src/db/models/GameMember.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';

const { refs, aliases, enums } = schemas;

export const zUpdateGameMember = z.object({
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

export type GameMember = z.infer<typeof zGameMember>;
export type GameMemberType = mongoose.InferRawDocType<GameMember>;
export type GameMemberDocument = mongoose.HydratedDocument<GameMemberType>;

const sessionRoleOptions = enums.sessionRoles.options;

const gameMemberSchema = new mongoose.Schema<GameMember>(
    {
        _id: { type: String, required: true },
        gameId: { type: String, required: true },
        userId: { type: String, required: true },
        joinedAt: { type: Date, required: true },
        role: { type: String, enum: sessionRoleOptions, required: true, default: 'spectator' },
        isSeated: { type: Boolean, required: true, default: false }
    },
    {
        timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' },
        collection: 'game_member'
    }
);

gameMemberSchema.index({ gameId: 1, userId: 1 }, { unique: true });
gameMemberSchema.index({ gameId: 1, role: 1 });

const modelName = 'game_member';
const existingModel = mongoose.models[modelName] as mongoose.Model<GameMember> | undefined;
export const GameMemberModel =
    existingModel ?? mongoose.model<GameMember>(modelName, gameMemberSchema);

const gameMemberModels = {
    schema: gameMemberSchema,
    model: GameMemberModel,
    insert: zGameMember,
    update: zUpdateGameMember
};

export default gameMemberModels;
