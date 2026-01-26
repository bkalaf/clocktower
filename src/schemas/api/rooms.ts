// src/schemas/api/rooms.ts
import z from 'zod/v4';
import aliases from '../aliases';
import enums from '../enums';
import refs from '../refs';

export const zRoomIdInput = z.object({
    roomId: aliases.gameId
});

export const zRoom = z.object({
    _id: aliases.gameId,
    allowTravellers: z.boolean(),
    banner: z.string().default(''),
    connectedUserIds: z.array(aliases.userId).default([]),
    endedAt: aliases.timestamp.optional(),
    hostUserId: refs.user,
    maxPlayers: aliases.pcPlayerCount.default(15),
    maxTravellers: aliases.pcTraverCount.default(0),
    minPlayers: aliases.pcPlayerCount.default(5),
    plannedStartTime: aliases.timestamp.optional(),
    scriptId: refs.script.optional(),
    skillLevel: enums.skillLevel.default('beginner'),
    storytellerUserIds: z.array(aliases.userId).default([]),
    speed: enums.gameSpeed.default('moderate'),
    visibility: enums.roomVisibility
});

export const zGameRoles = z.enum(['player', 'storyteller', 'spectator']);

export const zRoomDto = z.object({
    roomId: aliases.gameId,
    banner: z.string().optional(),
    hostUserId: refs.user,
    hostUsername: z.string().optional(),
    scriptId: refs.script.optional(),
    scriptName: z.string().optional(),
    speed: enums.gameSpeed,
    visibility: enums.roomVisibility,
    roles: z.array(z.string()).default([]),
    skillLevel: enums.skillLevel,
    maxPlayers: aliases.pcPlayerCount,
    minPlayers: aliases.pcPlayerCount,
    maxTravellers: aliases.pcTraverCount,
    allowTravellers: z.boolean(),
    plannedStartTime: z.string().optional(),
    connectedUserIds: z.record(aliases.userId, zGameRoles).default({}),
    playerCount: z.number().int().min(0)
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
        _id: z.string(),
        allowTravelers: z.boolean().optional().nullable(),
        visibility: enums.roomVisibility.optional().nullable(),
        scriptId: aliases.scriptId.optional().nullable(),
        status: enums.roomStatus.optional().nullable(),
        endedAt: aliases.timestamp.optional().nullable(),
        minPlayers: aliases.pcPlayerCount.optional().nullable(),
        maxPlayers: aliases.pcPlayerCount.optional().nullable(),
        maxTravelers: aliases.pcTraverCount.optional().nullable(),
        skillLevel: enums.skillLevel.optional().nullable(),
        plannedStartTime: aliases.timestamp.optional().nullable(),
        hostUserId: aliases.userId.optional().nullable()
    })
    .strict();

export const zCreateRoomInput = z.object({
    scriptId: aliases.scriptId.optional().nullable(),
    visibility: enums.roomVisibility.default('public'),
    status: enums.roomStatus.default('closed'),
    endedAt: aliases.timestamp.optional().nullable(),
    minPlayers: aliases.pcPlayerCount.default(5),
    maxPlayers: aliases.pcPlayerCount.default(15),
    maxTravelers: aliases.pcTraverCount.default(5),
    skillLevel: enums.skillLevel.default('beginner'),
    plannedStartTime: aliases.timestamp.optional().nullable(),
    hostUserId: aliases.userId.optional().nullable(),
    allowTravelers: z.boolean()
});

export const zCreateRoomOutput = z.object({
    _id: aliases.gameId
});

export const zRoomItemOutput = z.object({
    item: zRoomDto
});

export const zRoomDeleteOutput = z.object({
    ok: z.literal(true)
});

// export const zRoomStartGameInput = z.object({
//     roomId: aliases.gameId
// });

// export const zRoomStartGameOutput = z.object({
//     gameId: aliases.gameId
// });

export default {
    type: zRoom,
    dto: zRoomDto,
    listInput: zRoomListInput,
    listOutput: zRoomListResponse,
    patch: zRoomPatch,
    createInput: zCreateRoomInput,
    createOutput: zCreateRoomOutput,
    itemOutput: zRoomItemOutput,
    deleteOutput: zRoomDeleteOutput
    // startGameInput: zRoomStartGameInput,
    // startGameOutput: zRoomStartGameOutput
} as ZodObjects<
    'rooms',
    typeof zRoomDto,
    typeof zRoom,
    typeof zRoomListInput,
    typeof zRoomPatch,
    typeof zCreateRoomInput
>;
