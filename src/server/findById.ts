// src/server/findById.ts
import { GameModel } from '../db/models/game';
import { GameMemberModel } from '../db/models/gameMember';
import { GameId, GameRoles } from '../types/game';

// src/server/findById.ts
export const $findById = {
    game: (gameId: GameId) => GameModel.findById(gameId).lean()
};

export const $countDocuments = {
    gameMember: (gameId: GameId, role: GameRoles) => GameMemberModel.countDocuments({ gameId, role })
};
