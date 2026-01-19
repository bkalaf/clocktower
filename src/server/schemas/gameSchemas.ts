// src/server/schemas/gameSchemas.ts
import z from 'zod/v4';
import { zGameId, zUserId } from '../../schemas';

export const zPromoteStorytellerInput = z.object({
    userId: zUserId
});

export const zAssignHostInput = z.object({
    userId: zUserId
});

export const zStartSetupInput = z.object({
    // no body at the moment
});

export const zGameIdParams = z.object({
    gameId: zGameId
});

export const zReadyInput = z.object({
    gameId: zGameId,
    isReady: z.boolean().default(false)
});
