// src/schemas/index.ts
import z from 'zod/v4';
import enums from './enums';
import aliases from './aliases';
import refs from './refs';
import inputs from './inputs';
import { zUserSettings } from './settings';

export const zCreateLobbySettings = z.object({
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    maxTravelers: aliases.pcTraverCount.default(0),
    edition: enums.editions.optional().nullable(),
    skillLevel: enums.skillLevel.optional().nullable(),
    plannedStartTime: aliases.timestamp.optional().nullable()
});

export const zCreateGameInput = z.object({
    _id: aliases.gameId,
    version: aliases.version,
    snapshot: z.any(),
    hostUserId: refs.user,
    status: enums.roomStatus.default('closed'),
    scriptId: aliases.scriptId,
    allowTravelers: z.boolean().default(false),
    visibility: enums.roomVisibility.default('public'),
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
    passwordHash: aliases.passwordHash,
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

export const zRequireGameMemberOutput = z.object({
    role: enums.sessionRoles,
    userId: refs.user
});

const schemas = {
    enums,
    aliases,
    refs,
    inputs,
    settings: {
        user: zUserSettings
    }
};

export { zGameId } from './aliases/zGameId';
export { zUserId } from './aliases/zUserId';

export { zUserSettings };
export default schemas;
