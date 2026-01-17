// src/schemas/index.ts
import z from 'zod';

export const zGameId = z.uuid();
export const zUserId = z.uuid();
export const zName = z.string().min(1).max(64).optional().nullable();
export const zStreamId = z.uuid();
export const zSessionId = z.uuid();
export const zGameMemberId = z.uuid();
export const zChatItemInput = z.uuid();
export const zEmail = z.email().min(1).optional().nullable();
export const zPassword = z.string().min(64);
export const zTimestamp = z.int().min(0);
export const zGlobalRoles = z.enum(['moderator', 'user', 'admin']);
export const zGameRoles = z.enum(['player', 'storyteller', 'spectator']);
export const zTopicTypes = z.enum(['public', 'st', 'whisper']);
export const zGameStatus = z.enum(['idle', 'playing', 'reveal', 'setup', 'ended']);
export const zGameSpeed = z.enum(['fast', 'moderate', 'slow']);
export const zSkillLevel = z.enum(['novice', 'intermediate', 'advanced', 'expert']);
export const zEditions = z.enum(['tb', 'bmr', 'snv']);
export const zPlayCount = z.int().min(5).max(20);

export const zCreateLobbySettings = z.object({
    minPlayers: zPlayCount.optional().nullable(),
    maxPlayers: zPlayCount.optional().nullable(),
    canTravel: z.boolean().default(false),
    edition: zEditions.optional().nullable(),
    skillLevel: zSkillLevel.optional().nullable(),
    plannedStartTime: zTimestamp.optional().nullable()
});

export const zCreateGameInput = z.object({
    _id: zGameId,
    version: z.int().min(1).default(1),
    snapshot: z.any(),
    hostUserId: zUserId,
    status: zGameStatus.default('idle'),
    endedAt: zTimestamp.optional().nullable(),
    lobbySettings: zCreateLobbySettings
});

export const zSessionInput = z.object({
    _id: zSessionId,
    userId: zUserId,
    expiresAt: zTimestamp
});

export const zCreateGameInput2 = z.object({
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
    passwordHash: zPassword,
    roles: z.array(zGlobalRoles)
});

export const zCreateGameMemberInput = z.object({
    _id: zGameMemberId,
    gameId: zGameId,
    userId: zUserId,
    role: zGameRoles.default('spectator'),
    joinedAt: zTimestamp,
    isSeated: z.boolean().default(true)
});

export const zCreateChatItemInput = z.object({
    _id: 
})