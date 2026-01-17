// src/db/models/Game.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';

const zGame = z.object({
    _id: z.uuid('Must be a UUID'),
    version: z.int().min(0, 'Must be greater than or equal to 0.'),
    snapshot: z.any()
});

const gameModels = getTypesFor('Game', zGame, { timestamps: true, collection: 'game' }, {});

export type Game = z.infer<typeof zGame>;
export type GameType = mongoose.InferRawDocType<Game>;
export type GameDocument = mongoose.HydratedDocument<GameType>;
export const GameModel = gameModels.model;
export default gameModels;
