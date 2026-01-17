// src/db/models/Game.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { refs, aliases, enums } = schemas;

export const zLobbySettings = z.object({
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    allowTravelers: z.boolean().default(false),
    maxTravelers: aliases.pcTraverCount.default(0),
    edition: enums.editions.default('tb'),
    skillLevel: enums.skillLevel.default('novice'),
    plannedStart: aliases.timestamp,
    gameSpeed: enums.gameSpeed.default('moderate'),
    isPrivate: z.boolean().default(false),
    banner: z.string().optional().nullable()
});

const zGame = z.object({
    _id: aliases.gameId,
    version: aliases.version,
    snapshot: aliases.snapshot,
    hostUserId: refs.user,
    status: enums.gameStatus.default('idle'),
    endedAt: aliases.timestamp.optional().nullable(),
    lobbySettings: zLobbySettings
});

const gameModels = getTypesFor('Game', zGame, { timestamps: true, collection: 'game' }, {}, [
    { hostUserId: 1 },
    { unique: true }
]);

export type Game = z.infer<typeof zGame>;
export type GameType = mongoose.InferRawDocType<Game>;
export type GameDocument = mongoose.HydratedDocument<GameType>;
export const GameModel = gameModels.model;
export default gameModels;
