// src/serverFns/gameMember.ts
import { connectMongoose } from '../db/connectMongoose';
import { AuthedUser, GameId, UserId } from '../types/game';
import $models from '../db/models';
import { GameMember } from '../db/models/GameMember';
import { ProjectionType } from 'mongoose';

const findOne = async <T extends ProjectionType<GameMember>>(gameId: GameId, user: AuthedUser, projection?: T) => {
    await connectMongoose();
    return await $models.GameMemberModel.findOne({ gameId, userId: user._id }, projection);
};

const updateOneReady = async (gameId: GameId, userId: UserId, isReady: boolean) => {
    await connectMongoose();
    return await $models.GameMemberModel.updateOne({ gameId, userId }, { $set: { isReady } });
};

const $gameMember = {
    findOne,
    updateOne: {
        isReady: updateOneReady
    }
};

export default $gameMember;
