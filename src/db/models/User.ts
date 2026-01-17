// src/db/models/User.ts
import mongoose, { Schema } from 'mongoose';
import { User } from '../../types/game';

export const userSchema = new Schema(
    {
        _id: { type: String, required: true, minLength: 16 },
        name: { type: String, required: true, minLength: 1 },
        email: { type: String, required: true, unique: true, index: true },
        passwordHash: { type: String, required: true },
        userRoles: [{ type: String, enum: ['moderator', 'user', 'admin'], required: true }]
    },
    {
        timestamps: true
    }
);

export type UserType = mongoose.InferRawDocType<typeof userSchema>;
export type UserDocument = mongoose.HydratedDocument<UserType>;

export const UserModel =
    (mongoose.models['User'] as mongoose.Model<UserDocument>) || mongoose.model('User', userSchema);
