// src/server/authz/gameAuth.ts
import { connectMongoose } from '../../db/connectMongoose';
import { GameModel } from '../../db/models/game';
import { GameMemberModel } from '../../db/models/gameMember';
import { AuthedUser, GameId, UserId } from '../../types/game';

export async function requireGame(gameId: GameId) {
    await connectMongoose();
    const game = await GameModel.findById(gameId).lean();
    if (!game) throw new Error('game not found');
    return game;
}

export async function requireMember(gameId: GameId, userId: UserId) {
    await connectMongoose();
    const m = await GameMemberModel.findOne({ gameId, userId }).lean();
    if (!m) throw new Error('not in game');
    return m;
}

export async function requireHost(gameId: GameId, user: AuthedUser) {
    const game = await requireGame(gameId);
    if (game.hostUserId !== user._id) throw new Error('not host');
    return game;
}

export async function requireStoryteller(gameId: GameId, user: AuthedUser) {
    const m = await requireMember(gameId, user._id);
    if (m.role !== 'storyteller') throw new Error('not storyteller');
    return m;
}

export async function storytellerCount(gameId: GameId) {
    await connectMongoose();
    return GameMemberModel.countDocuments({ gameId, role: 'storyteller' });
}
export async function canHostEditLobby(gameId: GameId, user: AuthedUser) {
    const game = await requireHost(gameId, user);
    const stCount = await storytellerCount(gameId);
    return game.status === 'idle' && stCount === 0;
}
