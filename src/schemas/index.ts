// src/schemas/index.ts
import z from 'zod/v4';
import enums from './enums';
import aliases from './aliases';
import refs from './refs';
import { zAuthedUser } from '../db/models/AuthedUser';

export const zCreateLobbySettings = z.object({
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    canTravel: z.boolean().default(false),
    edition: enums.editions.optional().nullable(),
    skillLevel: enums.skillLevel.optional().nullable(),
    plannedStartTime: aliases.timestamp.optional().nullable()
});

export const zCreateGameInput = z.object({
    _id: aliases.gameId,
    version: aliases.version,
    snapshot: z.any(),
    hostUserId: refs.user,
    status: enums.gameStatus.default('idle'),
    endedAt: aliases.timestamp.optional().nullable(),
    lobbySettings: zCreateLobbySettings
});

export const zSessionInput = z.object({
    _id: aliases.sessionId,
    userId: refs.user,
    expiresAt: aliases.timestamp
});

export const zCreateGameInput2 = z.object({
    name: aliases.name
});

export const zCreateWhisperParams = z.object({
    gameId: refs.game
});

export const zCreateWhisperInput = z.object({
    participantUserIds: z.array(refs.gameMember).min(2),
    name: aliases.name,
    includeStoryTeller: z.boolean().default(true)
});

export const zCreateUserInput = z.object({
    _id: aliases.userId,
    name: aliases.name,
    email: aliases.email,
    passwordHash: aliases.password,
    roles: z.array(enums.globalRoles)
});

export const zCreateGameMemberInput = z.object({
    _id: aliases.gameMemberId,
    gameId: refs.game,
    userId: refs.user,
    role: enums.sessionRoles.default('spectator'),
    joinedAt: aliases.timestamp,
    isSeated: z.boolean().default(true)
});

export const zFindSessionInput = z.object({
    _id: aliases.sessionId,
    expiresAt: aliases.timestamp
});

export const zRequireRoleInput = z.object({
    gameId: refs.game,
    user: zAuthedUser,
    role: enums.sessionRoles
});

export const zRequireGameMemberInput = z.object({
    gameId: refs.game,
    user: zAuthedUser
});

export const zRequireGameMemberOutput = z.object({
    role: enums.sessionRoles,
    userId: refs.user
});

export const zFindUserInput = aliases.userId;

// export const zCreateChatItemInput = z.object({
//     _id:
// })

const schemas = {
    enums,
    aliases,
    refs
};

export default schemas;
