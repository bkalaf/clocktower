// src/db/models/User.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { zGlobalRoles } from '../../schemas';
import { getTypesFor } from '../../utils/zodToMongoose';

const zUser = z.object({
    _id: z.uuid('Must be a UUID'),
    name: z
        .string()
        .min(3, 'Must be over 3 characters long')
        .max(64, 'Must be under 64 characters')
        .meta({ description: 'Your displayed username.' }),
    email: z.email('Invalid email').meta({ description: 'Your e-mail (this is private and not shown to others).' }),
    passwordHash: z.string().min(8, 'Must be over 8 characters long.'),
    userRoles: z.array(zGlobalRoles).min(1, 'Must have at least 1 role.').default(['user'])
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
