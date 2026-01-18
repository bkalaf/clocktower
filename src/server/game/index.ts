// src/server/game/index.ts
import { GameModel } from '../../db/models/Game';
import { GameId, UserId } from '../../types/game';
import type { Room } from '../../types/room';
import { RoomStatus } from '../../types/room';

export const setStatus = async (gameId: GameId, status: RoomStatus, args?: Pick<Room, 'endedAt'>) =>
    GameModel.updateOne({ _id: gameId }, { $set: Object.assign({ status }, args ?? {}) });

export const setHostUserId = async (gameId: GameId, hostUserId: UserId) =>
    GameModel.updateOne({ _id: gameId }, { $set: { hostUserId: hostUserId } });

export const setEnded = async (gameId: GameId) => setStatus(gameId, 'archived', { endedAt: new Date().valueOf() });
