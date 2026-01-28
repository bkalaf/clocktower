// src/db/models/Session.ts
import mongoose, { Schema } from 'mongoose';
import z from 'zod/v4';
import refs from '../../schemas/refs';
import aliases from '../../schemas/aliases';

export interface Session {
    _id: string;
    userId: string;
    expiresAt: Date;
}

export const zSession = z
    .object({
        _id: aliases.sessionId,
        userId: refs.user,
        expiresAt: z.date()
    })
    .satisfies<z.ZodType<Session>>();

export type SessionType = mongoose.InferRawDocType<Session>;
export type SessionDocument = mongoose.HydratedDocument<SessionType>;

const sessionSchema = new Schema<Session>(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true, ref: 'user' },
        expiresAt: { type: Date, required: true }
    },
    {
        timestamps: true,
        collection: 'session'
    }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const modelName = 'session';
const existingModel = mongoose.models[modelName] as mongoose.Model<Session> | undefined;
export const SessionModel = existingModel ?? mongoose.model<Session>(modelName, sessionSchema);

const sessionModels = {
    schema: sessionSchema,
    model: SessionModel,
    insert: zSession
};

export default sessionModels;
