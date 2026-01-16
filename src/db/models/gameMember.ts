// src/db/models/gameMember.ts
import mongoose, { Schema } from 'mongoose';
import { GameMember } from '../../types/game';

const gameMemberSchema = new Schema<GameMember>(
    {
        _id: { type: String, required: true, minLength: 16 },
        gameId: { type: String, required: true, index: true, minLength: 16 },
        userId: { type: String, required: true, index: true, minLength: 16 },
        role: { type: String, enum: ['storyteller', 'player', 'spectator'], required: true }
    },
    {
        timestamps: true
    }
);

gameMemberSchema.index({ gameId: 1, userId: 1 }, { unique: true });
gameMemberSchema.index({ gameId: 1, role: 1 });

export const GameMemberModel =
    (mongoose.models['GameMember'] as mongoose.Model<GameMember>) ??
    mongoose.model<GameMember>('GameMember', gameMemberSchema);

export type GameMemberType = mongoose.InferRawDocType<GameMember>;
export type GameMemberDocument = mongoose.HydratedDocument<GameMemberType>;
