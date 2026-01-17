// src/server/findById.ts
import { GameModel } from '../db/models/Game';
import { GameMemberModel } from '../db/models/GameMember';
import { GameId, GameRoles, UserId } from '../types/game';

export const $findById = {
    game: (gameId: GameId) => GameModel.findById(gameId).lean(),
    gameMember: (gameId: GameId, userId: string) => GameMemberModel.findOne({ gameId, userId }).lean()
};

export const $findOne = {
    gameMember: (gameId: GameId, userId: UserId) => GameMemberModel.findOne({ gameId, userId }).lean()
};

export const $countDocuments = {
    gameMember: (gameId: GameId, role: GameRoles) => GameMemberModel.countDocuments({ gameId, role })
};
