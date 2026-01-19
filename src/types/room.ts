// src/types/room.ts
import { zRoomStatus } from '@/schemas/enums/zRoomStatus';
import { zRoomVisibility } from '@/schemas/enums/zRoomVisibility';
import { zRoomDto, zRoomIdInput, zRoomListResponse, zRoomPatch, zRoomLobbySettings } from '@/schemas/api/rooms';
import type { Game } from '@/db/models/Game';
import z from 'zod/v4';

export type RoomStatus = z.infer<typeof zRoomStatus>;
export type RoomVisibility = z.infer<typeof zRoomVisibility>;
export type RoomLobbySettings = z.infer<typeof zRoomLobbySettings>;
export type RoomId = z.infer<typeof zRoomIdInput>['roomId'];
export type Room = Game;

export type RoomDTO = z.infer<typeof zRoomDto>;
export type RoomPatch = z.infer<typeof zRoomPatch>;
export type RoomListResponse = z.infer<typeof zRoomListResponse>;
