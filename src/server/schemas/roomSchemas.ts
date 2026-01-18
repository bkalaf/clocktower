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

export const zCreateRoomInput = z.object({
    scriptId: aliases.scriptId,
    visibility: enums.roomVisibility.default('public'),
    allowTravelers: z.boolean().default(false),
    lobbySettings: z
        .object({
            minPlayers: aliases.pcPlayerCount.default(5),
            maxPlayers: aliases.pcPlayerCount.default(15),
            maxTravelers: aliases.pcTraverCount.default(0),
            edition: enums.editions.optional().nullable(),
            skillLevel: enums.skillLevel.optional().nullable(),
            plannedStartTime: aliases.timestamp.optional().nullable()
        })
        .optional()
});

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
    breakoutWhispersEnabled: z.boolean().optional()
});

export const zTravelerDecisionInput = z.object({
    requestId: aliases.travelerRequestId,
    message: z.string().optional().nullable()
});
