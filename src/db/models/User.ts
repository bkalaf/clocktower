// src/db/models/User.ts
import mongoose, { Schema } from 'mongoose';
import z from 'zod/v4';
import aliases from '../../schemas/aliases';
import enums from '../../schemas/enums';
import { zAuthedUser } from './AuthedUser';

export const zUser = z.object({
    ...zAuthedUser.shape,
    passwordHash: aliases.password
});

export type User = z.infer<typeof zUser>;

const globalRoleValues = enums.globalRoles.options;

const userSchema = new Schema<User>(
    {
        _id: { type: String, required: true },
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        userRoles: {
            type: [String],
            enum: globalRoleValues,
            required: true,
            default: ['user']
        },
        penaltyUntil: { type: Date, default: null },
        passwordHash: { type: String, required: true, minlength: 8, maxlength: 64 }
    },
    {
        timestamps: true,
        collection: 'user'
    }
);

userSchema.index({ email: 1 }, { unique: true });

const modelName = 'user';
const existingModel = mongoose.models[modelName] as mongoose.Model<User> | undefined;
const initializedModel = existingModel ?? mongoose.model<User>(modelName, userSchema);

export const UserModel = initializedModel;

const userModels = {
    schema: userSchema,
    model: initializedModel,
    insert: zUser
};

export default userModels;
