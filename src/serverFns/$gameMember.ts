// src/serverFns/$gameMember.ts
import { connectMongoose } from '../db/connectMongoose';
import { GameMemberModel } from '../server/schemas/$z';
import { AuthedUser, GameId, UserId } from '../types/game';

const findOne = async (gameId: GameId, user: AuthedUser) => {
    await connectMongoose();
    return await GameMemberModel.findOne({ gameId, userId: user._id }).lean();
};

const updateOneReady = async (gameId: GameId, userId: UserId, isReady: boolean) => {
    await connectMongoose();
    return await GameMemberModel.updateOne({ gameId, userId }, { $set: { isReady } });
};

const $gameMember = {
    findOne,
    updateOne: updateOneReady
};

export default $gameMember;
