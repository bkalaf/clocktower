// src/serverFns/$user.ts
import { connectMongoose } from '../db/connectMongoose';
import { UserModel } from '../db/models/User';

const findById = async (userId: string) => {
    await connectMongoose();
    return UserModel.findById(userId).lean();
};

const $user = {
    findById
};

export default $user;
