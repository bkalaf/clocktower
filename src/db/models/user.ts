// src/db/models/user.ts
import mongoose, { Schema } from 'mongoose';
import { User } from '../../types/game';

export const userSchema = new Schema(
    {
        _id: { type: String, required: true, minLength: 16 },
        name: { type: String, required: true, minLength: 1 },
        email: { type: String },
        passwordHash: { type: String, required: true },
        userRoles: [{ type: String, enum: ['moderator', 'user', 'admin'], required: true }]
    },
    {
        timestamps: true
    }
);

export const UserModel = (mongoose.models['User'] as mongoose.Model<User>) || mongoose.model('User', userSchema);
