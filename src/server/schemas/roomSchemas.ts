// src/server/schemas/roomSchemas.ts
import z from 'zod/v4';
import aliases from '../../schemas/aliases';
import enums from '../../schemas/enums';

export const zRoomIdParams = z.object({
    roomId: aliases.gameId
});

export const zMatchIdParams = z.object({
    matchId: aliases.matchId
});

export const zInviteIdParams = z.object({
    inviteId: aliases.inviteId
});

export const ROOM_MOD_REASON_CODES = ['no_show', 'behavior', 'vacated_seat', 'other'] as const;

const zNominationType = z.enum(['execution', 'exile']);
const zVoteChoice = z.enum(['yes', 'no', 'abstain']);
const zVoteRecord = z.object({
    voterId: aliases.userId,
    choice: zVoteChoice,
    usedGhost: z.boolean().optional()
});
const zVoteHistoryEntry = z.object({
    day: z.number().int().min(1),
    nominationType: zNominationType,
    nominatorId: aliases.userId,
    nomineeId: aliases.userId,
    votesFor: z.number().int().min(0),
    threshold: z.number().int().min(0),
    passed: z.boolean(),
    votes: z.array(zVoteRecord),
    ts: aliases.timestamp
});
const zOnTheBlock = z
    .object({
        nomineeId: aliases.userId,
        votesFor: z.number().int().min(0),
        nominatorId: aliases.userId
    })
    .nullable();

export const zChangeScriptInput = z.object({
    scriptId: aliases.scriptId
});

export const zCreateInvitesInput = z.object({
    invitedUserIds: z.array(aliases.userId).min(1),
    kind: z.enum(['seat', 'spectator']),
    message: z.string().optional().nullable()
});

export const zModerationActionInput = z.object({
    userId: aliases.userId,
    reasonCode: z.enum(ROOM_MOD_REASON_CODES),
    message: z.string().optional().nullable()
});

export const zTravelRequestInput = z.object({
    message: z.string().optional().nullable()
});

export const zMatchPhaseInput = z.object({
    phase: enums.matchPhase,
    subphase: enums.matchSubphase,
    dayNumber: z.number().int().min(1).optional(),
    nominationsOpen: z.boolean().optional(),
    breakoutWhispersEnabled: z.boolean().optional(),
    playerSeatMap: z.record(aliases.userId, z.unknown()).optional(),
    aliveById: z.record(aliases.userId, z.boolean()).optional(),
    isTravelerById: z.record(aliases.userId, z.boolean()).optional(),
    ghostVoteAvailableById: z.record(aliases.userId, z.boolean()).optional(),
    voteHistory: z.array(zVoteHistoryEntry).optional(),
    onTheBlock: zOnTheBlock.optional(),
    nomination: z
        .object({
            nominatorId: aliases.userId,
            nomineeId: aliases.userId,
            nominationType: zNominationType,
            openedAt: aliases.timestamp.optional()
        })
        .optional()
});

export const zTravelerDecisionInput = z.object({
    requestId: aliases.travelerRequestId,
    message: z.string().optional().nullable()
});
