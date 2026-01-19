// src/schemas/api/rooms.ts
import z from 'zod/v4';
import aliases from '../aliases';
import enums from '../enums';

export const zRoomIdInput = z.object({
    roomId: aliases.gameId
});

export const zRoomLobbySettings = z.object({
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    maxTravelers: aliases.pcTraverCount.default(0),
    edition: enums.editions.optional().nullable(),
    skillLevel: enums.skillLevel.optional().nullable(),
    plannedStartTime: aliases.timestamp.optional().nullable()
});

export const zRoomDto = z.object({
    id: aliases.gameId,
    hostUserId: aliases.userId,
    status: enums.roomStatus,
    scriptId: aliases.scriptId,
    allowTravelers: z.boolean(),
    visibility: enums.roomVisibility,
    endedAt: aliases.timestamp.optional().nullable(),
    lobbySettings: zRoomLobbySettings.optional().nullable(),
    createdAt: aliases.timestamp.optional().nullable(),
    updatedAt: aliases.timestamp.optional().nullable()
});

export const zRoomListInput = z.object({
    q: z.string().min(1).optional(),
    openOnly: z.boolean().optional()
});

export const zRoomListResponse = z.object({
    rooms: z.array(zRoomDto)
});

export const zRoomPatch = z
    .object({
        allowTravelers: z.boolean().optional(),
        visibility: enums.roomVisibility.optional(),
        lobbySettings: zRoomLobbySettings.optional().nullable(),
        scriptId: z.union([aliases.scriptId, z.null()]).optional(),
        status: enums.roomStatus.optional(),
        endedAt: aliases.timestamp.optional().nullable()
    })
    .strict();

export const zCreateRoomInput = z.object({
    scriptId: aliases.scriptId,
    visibility: enums.roomVisibility.default('public'),
    allowTravelers: z.boolean().default(false),
    lobbySettings: zRoomLobbySettings.optional()
});

export const zCreateRoomOutput = z.object({
    roomId: aliases.gameId
});

export const zRoomItemOutput = z.object({
    item: zRoomDto
});

export const zRoomDeleteOutput = z.object({
    ok: z.literal(true)
});

export const zRoomStartGameInput = z.object({
    roomId: aliases.gameId
});

export const zRoomStartGameOutput = z.object({
    gameId: aliases.gameId
});
