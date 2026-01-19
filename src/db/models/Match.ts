// src/db/models/Match.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { aliases, refs, enums } = schemas;

export const zMatch = z.object({
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

const matchModels = getTypesFor('match', zMatch, { timestamps: true, collection: 'match' }, {}, [{ roomId: 1 }]);

export type Match = z.infer<typeof zMatch>;
export type MatchType = mongoose.InferRawDocType<Match>;
export type MatchDocument = mongoose.HydratedDocument<MatchType>;
export const MatchModel = matchModels.model;
export default matchModels;
