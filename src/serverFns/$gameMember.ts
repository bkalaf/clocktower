// src/serverFns/$gameMember.ts
import { connectMongoose } from '../db/connectMongoose';
import { GameMemberModel } from '../db/models/gameMember';
import { AuthedUser, GameId, GameMember, UserId } from '../types/game';

const findOne = async (gameId: GameId, user: AuthedUser) => {
    await connectMongoose();
    return await GameMemberModel.findOne({ gameId, userId: user._id }).lean();
};
type UpdateOne = Partial<Omit<GameMember, 'joinedAt' | '_id' | 'userId' | 'gameId'>>;

const updateOneReady = async (gameId: GameId, userId: UserId, isReady: boolean) => {
    await connectMongoose();
    return await GameMemberModel.updateOne({ gameId, userId }, { $set: { isReady } });
}

const $gameMember = {
    findOne
};

export default $gameMember;
