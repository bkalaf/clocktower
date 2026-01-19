// src/serverFns/user.ts
import { connectMongoose } from '../db/connectMongoose';
import $models from '../db/models';

const findById = async (userId: string) => {
    await connectMongoose();
    return $models.UserModel.findById(userId);
};

const $user = {
    findById
};

export default $user;
