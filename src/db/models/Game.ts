// src/db/models/Game.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { refs, aliases, enums } = schemas;

export const zLobbySettings = z.object({
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    maxTravelers: aliases.pcTraverCount.default(0),
    edition: enums.editions.default('tb'),
    skillLevel: enums.skillLevel.default('novice'),
    plannedStartTime: aliases.timestamp.optional().nullable(),
    gameSpeed: enums.gameSpeed.default('moderate'),
    isPrivate: z.boolean().default(false),
    banner: z.string().optional().nullable()
});

export const zGame = z.object({
    _id: aliases.gameId,
    version: aliases.version,
    snapshot: aliases.snapshot,
    hostUserId: refs.user,
    status: enums.roomStatus.default('closed'),
    scriptId: aliases.scriptId,
    allowTravelers: z.boolean().default(false),
    visibility: enums.roomVisibility.default('public'),
    endedAt: aliases.timestamp.optional().nullable(),
    lobbySettings: zLobbySettings.optional().nullable()
});

const gameModels = getTypesFor('game', zGame, { timestamps: true, collection: 'game' }, {}, [
    { hostUserId: 1 },
    { unique: true }
]);

export type Game = z.infer<typeof zGame>;
export type GameType = mongoose.InferRawDocType<Game>;
export type GameDocument = mongoose.HydratedDocument<GameType>;
export const GameModel = gameModels.model;
export default gameModels;
