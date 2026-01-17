// src/schemas/index.ts
import z from 'zod/v4';

export const zGameId = z.uuid('GameId must be uuid');
export const zUserId = z.uuid('UserId must be uuid');
export const zName = z.string().min(1, 'Field is required');
export const zStreamId = z.uuid('StreamId must be uuid');
export const zSessionId = z.uuid('SessionId must be uuid');
export const zGameMemberId = z.uuid('GameMemberId must be uuid');
export const zChatItemInput = z.uuid('ChatItemId must be a uuid');
export const zEmail = z.email('Invalid email').min(1);
export const zPassword = z.string().min(8, 'Password must be at least 8 characters long');
export const zTimestamp = z.int().min(0);
export const zVersion = z.int().min(0, 'Version must be greater than or equal to 0').default(1);
export const zGlobalRoles = z.enum(['moderator', 'user', 'admin']);
export const zGameRoles = z.enum(['player', 'storyteller', 'spectator']);
export const zTopicTypes = z.enum(['public', 'st', 'whisper']);
export const zGameStatus = z.enum(['idle', 'playing', 'reveal', 'setup', 'ended']);
export const zGameSpeed = z.enum(['fast', 'moderate', 'slow']);
export const zSkillLevel = z.enum(['novice', 'intermediate', 'advanced', 'expert']);
export const zEditions = z.enum(['tb', 'bmr', 'snv']);
export const zPlayCount = z
    .int()
    .min(5, 'Play count must be between 5 and 15')
    .max(15, 'Play count must be between 5 and 15');



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
    version: zVersion,
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

export const zFindSessionInput = z.object({
    _id: zSessionId,
    expiresAt: zTimestamp
});

export const zAuthedUser = z.object({
    _id: zUserId,
    name: zName,
    email: zEmail,
    userRoles: z.array(zGlobalRoles)
});

export const zRequireRoleInput = z.object({
    gameId: zGameId,
    user: zAuthedUser,
    role: zGameRoles
});

export const zRequireGameMemberInput = z.object({
    gameId: zGameId,
    user: zAuthedUser
});

export const zRequireGameMemberOutput = z.object({
    role: zGameRoles,
    userId: zUserId
});

export const zFindUserInput = zUserId;

// export const zCreateChatItemInput = z.object({
//     _id:
// })
