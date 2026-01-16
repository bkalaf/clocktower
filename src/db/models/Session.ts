// src/db/models/Session.ts
import mongoose, { Schema } from 'mongoose';
import { Session } from '../../types/game';

const sessionSchema = new Schema<Session>(
    {
        _id: { type: String, required: true, minLength: 16 },
        userId: { type: String, required: true, minLength: 16 },
        expiresAt: { type: Number, required: true, index: true }
    },
    {
        timestamps: true
    }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel =
    (mongoose.models['Session'] as mongoose.Model<Session>) || mongoose.model<Session>('Session', sessionSchema);
