// src/db/models/_Game.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';
const { refs, aliases, enums } = schemas;

export const zLobbySettings = z.object({
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    maxTravelers: aliases.pcTraverCount.default(0),
    edition: enums.editions.default('tb'),
    skillLevel: enums.skillLevel.default('beginner'),
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
    endedAt: aliases.timestamp,
    lobbySettings: zLobbySettings.optional().nullable()
});

export type Game = z.infer<typeof zGame>;
export type GameType = mongoose.InferRawDocType<Game>;
export type GameDocument = mongoose.HydratedDocument<GameType>;

const playerCountOptions = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const;
const travelerCountOptions = [0, 1, 2, 3, 4, 5] as const;
const editionOptions = enums.editions.options;
const skillLevelOptions = enums.skillLevel.options;
const gameSpeedOptions = enums.gameSpeed.options;
const roomStatusOptions = enums.roomStatus.options;
const visibilityOptions = enums.roomVisibility.options;

const lobbySettingsSchema = new mongoose.Schema(
    {
        minPlayers: { type: Number, required: true, enum: playerCountOptions, default: 5 },
        maxPlayers: { type: Number, required: true, enum: playerCountOptions, default: 15 },
        maxTravelers: { type: Number, required: true, enum: travelerCountOptions, default: 0 },
        edition: { type: String, required: true, enum: editionOptions, default: 'tb' },
        skillLevel: { type: String, required: true, enum: skillLevelOptions, default: 'beginner' },
        plannedStartTime: { type: Date, default: null },
        gameSpeed: { type: String, required: true, enum: gameSpeedOptions, default: 'moderate' },
        isPrivate: { type: Boolean, required: true, default: false },
        banner: { type: String, default: null }
    },
    { _id: false }
);

const gameSchema = new mongoose.Schema<Game>(
    {
        _id: { type: String, required: true },
        version: { type: Number, required: true, default: 1 },
        snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
        hostUserId: { type: String, required: true },
        status: { type: String, required: true, enum: roomStatusOptions, default: 'closed' },
        scriptId: { type: String, required: true },
        allowTravelers: { type: Boolean, required: true, default: false },
        visibility: { type: String, required: true, enum: visibilityOptions, default: 'public' },
        endedAt: { type: Date, default: null },
        lobbySettings: { type: lobbySettingsSchema, default: null }
    },
    {
        timestamps: true,
        collection: 'game'
    }
);

gameSchema.index({ hostUserId: 1 }, { unique: true });

const modelName = 'game';
const existingModel = mongoose.models[modelName] as mongoose.Model<Game> | undefined;
export const GameModel = existingModel ?? mongoose.model<Game>(modelName, gameSchema);

const gameModels = {
    schema: gameSchema,
    model: GameModel,
    insert: zGame
};

export default gameModels;
