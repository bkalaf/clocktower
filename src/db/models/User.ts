// src/db/models/User.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import aliases from '../../schemas/aliases';
import { zAuthedUser } from './AuthedUser';

const zUser = z.object({
    ...zAuthedUser.shape,
    passwordHash: aliases.password
});

const userModels = getTypesFor(
    'User',
    zUser,
    {
        timestamps: true,
        collection: 'user'
    },
    {},
    [{ email: 1 }, { unique: true }]
);

export type User = z.infer<typeof zUser>;
export type UserType = mongoose.InferRawDocType<User>;
export type UserDocument = mongoose.HydratedDocument<UserType>;
export const UserModel = userModels.model;
export default userModels;
