// src/db/models/Game.ts
import mongoose, { Schema } from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';

const { aliases, refs, enums } = schemas;

export const zGame = z.object({
    _id: aliases.matchId,
    roomId: refs.game,
    status: enums.matchStatus.default('setup'),
    phase: enums.matchPhase.default('day'),
    subphase: enums.matchSubphase.default('day.dawn_announcements'),
    dayNumber: z.number().int().min(1).default(1),
    allowTravelers: z.boolean().default(false),
    travelerUserIds: z.array(aliases.userId).default([]),
    travelerCountUsed: z.number().int().min(0).default(0),
    travelerLimit: z.number().int().min(0).default(5),
    playerSeatMap: z.record(aliases.userId, z.unknown()).default({}),
    nominationsOpen: z.boolean().default(false),
    breakoutWhispersEnabled: z.boolean().default(true),
    dayNominated: z.array(aliases.userId).default([]),
    dayNominators: z.array(aliases.userId).default([]),
    aliveById: z.record(aliases.userId, z.boolean()).default({}),
    isTravelerById: z.record(aliases.userId, z.boolean()).default({}),
    ghostVoteAvailableById: z.record(aliases.userId, z.boolean()).default({}),
    onTheBlock: z
        .object({
            nomineeId: aliases.userId,
            votesFor: z.number().int().min(0),
            nominatorId: aliases.userId
        })
        .optional()
        .nullable(),
    voteHistory: z
        .array(
            z.object({
                day: z.number().int().min(1),
                nominationType: z.enum(['execution', 'exile']),
                nominatorId: aliases.userId,
                nomineeId: aliases.userId,
                votesFor: z.number().int().min(0),
                threshold: z.number().int().min(0),
                passed: z.boolean(),
                votes: z.array(
                    z.object({
                        voterId: aliases.userId,
                        choice: z.enum(['yes', 'no', 'abstain']),
                        usedGhost: z.boolean().optional()
                    })
                ),
                ts: z.number().int()
            })
        )
        .default([])
        .optional()
        .nullable()
});

export type Game = z.infer<typeof zGame>;
export type GameType = mongoose.InferRawDocType<Game>;
export type GameDocument = mongoose.HydratedDocument<GameType>;

const matchStatusOptions = enums.matchStatus.options;
const matchPhaseOptions = enums.matchPhase.options;
const matchSubphaseOptions = enums.matchSubphase.options;

const voteChoiceOptions = ['yes', 'no', 'abstain'] as const;
const nominationTypeOptions = ['execution', 'exile'] as const;

const onTheBlockSchema = new Schema(
    {
        nomineeId: { type: String, required: true },
        votesFor: { type: Number, required: true, min: 0 },
        nominatorId: { type: String, required: true }
    },
    { _id: false }
);

const voteSchema = new Schema(
    {
        voterId: { type: String, required: true },
        choice: { type: String, required: true, enum: voteChoiceOptions },
        usedGhost: { type: Boolean }
    },
    { _id: false }
);

const voteHistoryEntrySchema = new Schema(
    {
        day: { type: Number, required: true, min: 1 },
        nominationType: { type: String, required: true, enum: nominationTypeOptions },
        nominatorId: { type: String, required: true },
        nomineeId: { type: String, required: true },
        votesFor: { type: Number, required: true, min: 0 },
        threshold: { type: Number, required: true, min: 0 },
        passed: { type: Boolean, required: true },
        votes: { type: [voteSchema], required: true },
        ts: { type: Number, required: true }
    },
    { _id: false }
);

const gameSchema = new Schema<Game>(
    {
        _id: { type: String, required: true },
        roomId: { type: String, required: true },
        status: { type: String, enum: matchStatusOptions, required: true, default: 'setup' },
        phase: { type: String, enum: matchPhaseOptions, required: true, default: 'day' },
        subphase: {
            type: mongoose.Schema.Types.Mixed
            // type: String,
            // enum: matchSubphaseOptions,
            // required: true,
            // default: 'day.dawn_announcements'
        },
        dayNumber: { type: Number, required: true, min: 1, default: 1 },
        allowTravelers: { type: Boolean, required: true, default: false },
        travelerUserIds: { type: [String], required: true, default: [] },
        travelerCountUsed: { type: Number, required: true, min: 0, default: 0 },
        travelerLimit: { type: Number, required: true, min: 0, default: 5 },
        playerSeatMap: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        nominationsOpen: { type: Boolean, required: true, default: false },
        breakoutWhispersEnabled: { type: Boolean, required: true, default: true },
        dayNominated: { type: [String], required: true, default: [] },
        dayNominators: { type: [String], required: true, default: [] },
        aliveById: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        isTravelerById: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        ghostVoteAvailableById: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        onTheBlock: { type: onTheBlockSchema, default: null },
        voteHistory: { type: [voteHistoryEntrySchema], default: [] }
    },
    {
        timestamps: true,
        collection: 'match'
    }
);

gameSchema.index({ roomId: 1 });

const modelName = 'match';
const existingModel = mongoose.models[modelName] as mongoose.Model<Game> | undefined;
export const GameModel = existingModel ?? mongoose.model<Game>(modelName, gameSchema);

const gameModels = {
    schema: gameSchema,
    model: GameModel,
    insert: zGame
};

export const zMatch = zGame;
export type Match = Game;
export type MatchType = GameType;
export type MatchDocument = GameDocument;
export const MatchModel = GameModel;

export const matchModels = gameModels;
export default gameModels;
