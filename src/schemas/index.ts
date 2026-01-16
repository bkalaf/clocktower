// src/schemas/index.ts
import z from 'zod';

export const zGameId = z.uuid();
export const zUserId = z.uuid();
export const zName = z.string().min(1).max(64).optional().nullable();
export const streamId = z.uuid();
export const zEmail = z.email().min(1).optional().nullable();
export const zPassword = z.string().min(64);

export const zCreateGameInput = z.object({
    name: zName
});

export const zCreateWhisperParams = z.object({
    gameId: zGameId
});

export const zCreateWhisperInput = z.object({
    participantUserIds: z.array(zUserId).min(2),
    name: zName,
    includeStoryTeller: z.boolean().default(true)
});

export const zCreateUserInput = z.object({
    _id: zUserId,
    name: zName,
    email: zEmail,
    passwordHash: zPassword
});
