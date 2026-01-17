// src/server/game/index.ts
import { GameModel } from '../../db/models/Game';
import { Game, GameId, GameStatus, UserId } from '../../types/game';

export const setStatus = async (gameId: GameId, status: GameStatus, args?: Pick<Game, 'endedAt'>) =>
    GameModel.updateOne({ _id: gameId }, { $set: Object.assign({ status }, args ?? {}) });

export const setHostUserId = async (gameId: GameId, hostUserId: UserId) =>
    GameModel.updateOne({ _id: gameId }, { $set: { hostUserId: hostUserId } });

export const setEnded = async (gameId: GameId) => setStatus(gameId, 'ended', { endedAt: new Date().valueOf() });
