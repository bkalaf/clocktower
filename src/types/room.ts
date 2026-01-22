// src/types/room.ts
import { zRoomStatus } from '@/schemas/enums/zRoomStatus';
import { zRoomVisibility } from '@/schemas/enums/zRoomVisibility';
import { zRoomDto, zRoomIdInput, zRoomListResponse, zRoomPatch, zRoom } from '@/schemas/api/rooms';
import z from 'zod/v4';
import mongoose from 'mongoose';

export type RoomStatus = z.infer<typeof zRoomStatus>;
export type RoomVisibility = z.infer<typeof zRoomVisibility>;
export type RoomId = z.infer<typeof zRoomIdInput>['roomId'];
export type Room = z.infer<typeof zRoom>;
export type RoomDocument = mongoose.HydratedDocument<Room>;
export type RoomDTO = z.infer<typeof zRoomDto>;
export type RoomPatch = z.infer<typeof zRoomPatch>;
export type RoomListResponse = z.infer<typeof zRoomListResponse>;
