// src/types/room.ts
import { zRoomStatus } from '@/schemas/enums/zRoomStatus';
import { zRoomVisibility } from '@/schemas/enums/zRoomVisibility';
import { zLobbySettings } from '@/db/models/Game';
import type { Game } from '@/db/models/Game';

export type RoomStatus = z.infer<typeof zRoomStatus>;
export type RoomVisibility = z.infer<typeof zRoomVisibility>;
export type RoomLobbySettings = z.infer<typeof zLobbySettings>;
export type RoomId = Game['_id'];
export type Room = Game;
