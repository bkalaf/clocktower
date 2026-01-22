// src/shared/api/endpoints.ts
import { defineCommand, defineQuery } from './endpoint';
import { z } from 'zod';
import aliases from '@/schemas/aliases';
import {
    zCreateRoomInput,
    zCreateRoomOutput,
    zRoomDeleteOutput,
    zRoomIdInput,
    zRoomItemOutput,
    zRoomListInput,
    zRoomListResponse,
    zRoomPatch
    // zRoomStartGameInput,
    // zRoomStartGameOutput
} from '@/schemas/api/rooms';

const zAuthSessionOutput = z.object({
    userId: z.string().nullable(),
    lastRoomId: z.string().optional(),
    lastGameId: z.string().optional()
});

const zAuthLoginInput = z.object({
    email: z.email(),
    password: z.string()
});

const zOkResponse = z.object({
    ok: z.literal(true)
});

const zGameIdInput = z.object({
    gameId: aliases.gameId
});

const zGameResponse = z.object({
    game: z.unknown()
});

const zGameUiResponse = z.object({
    can: z.record(z.string(), z.boolean())
});

const zGameActionInput = z.object({
    gameId: aliases.gameId,
    action: z.unknown()
});

const zGameActionResponse = z.object({
    ok: z.literal(true),
    game: z.unknown().optional()
});

const zInvitesListResponse = z.object({
    invites: z.array(z.unknown())
});

const zInvitesCreateInput = z.object({
    roomId: aliases.gameId,
    toUserId: aliases.userId
});

const zInvitesCreateOutput = z.object({
    inviteId: aliases.inviteId
});

const zInvitesAcceptInput = z.object({
    roomId: aliases.gameId,
    inviteId: aliases.inviteId
});

export const api = {
    auth: {
        getSession: defineQuery('/auth/session', z.undefined(), zAuthSessionOutput),
        login: defineCommand('/auth/login', zAuthLoginInput, zOkResponse),
        logout: defineCommand('/auth/logout', z.undefined(), zOkResponse)
    },
    rooms: {
        list: defineQuery('/rooms', zRoomListInput, zRoomListResponse),
        get: defineQuery('/rooms/:roomId', zRoomIdInput, zRoomItemOutput),
        create: defineCommand('/rooms', zCreateRoomInput, zCreateRoomOutput),
        updateOne: defineCommand(
            '/rooms/:roomId/update',
            z.object({ roomId: aliases.gameId, patch: zRoomPatch }),
            zRoomItemOutput
        ),
        deleteOne: defineCommand('/rooms/:roomId/delete', zRoomIdInput, zRoomDeleteOutput)
        // startGame: defineCommand('/rooms/:roomId/start', zRoomStartGameInput, zRoomStartGameOutput)
    },
    games: {
        get: defineQuery('/games/:gameId', zGameIdInput, zGameResponse),
        ui: defineQuery('/games/:gameId/ui', zGameIdInput, zGameUiResponse),
        action: defineCommand('/games/:gameId/action', zGameActionInput, zGameActionResponse)
    },
    invites: {
        list: defineQuery('/rooms/:roomId/invites', zRoomIdInput, zInvitesListResponse),
        create: defineCommand('/rooms/:roomId/invites', zInvitesCreateInput, zInvitesCreateOutput),
        accept: defineCommand('/rooms/:roomId/invites/:inviteId/accept', zInvitesAcceptInput, zOkResponse)
    }
} as const;
