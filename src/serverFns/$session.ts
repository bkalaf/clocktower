// src/serverFns/$session.ts
import { connectMongoose } from '../db/connectMongoose';
import { SessionModel } from '../db/models/Session';
import { SessionId } from '../types/game';

const findOne = async (_id: SessionId, expiresAt: number = Date.now()) => {
    await connectMongoose();
    return await SessionModel.findOne({ _id, expiresAt: { $gt: expiresAt } });
};

const $session = {
    findOne
};

export default $session;
