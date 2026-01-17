// src/db/models/gameMember.ts
import mongoose, { Schema } from 'mongoose';
import z from 'zod';
import zodToMongoose
// const gameMemberSchema = new Schema<GameMember>(
//     {
//         _id: { type: String, required: true, minLength: 16 },
//         gameId: { type: String, required: true, index: true, minLength: 16 },
//         userId: { type: String, required: true, index: true, minLength: 16 },
//         role: { type: String, enum: ['storyteller', 'player', 'spectator'], required: true }
//     },
//     {
//         timestamps: {
//             createdAt: 'joinedAt',
//             updatedAt: 'updatedAt'
//         }
//     }
// );

gameMemberSchema.index({ gameId: 1, userId: 1 }, { unique: true });
gameMemberSchema.index({ gameId: 1, role: 1 });

export type GameMember = z.infer<zGameMember>;
export type GameMemberType = mongoose.InferRawDocType<GameMember>;
export type GameMemberDocument = mongoose.HydratedDocument<GameMemberType>;

export const GameMemberModel =
    (mongoose.models['GameMember'] as mongoose.Model<GameMember>) ??
    mongoose.model<GameMember>('GameMember', gameMemberSchema);
