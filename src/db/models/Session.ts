// src/db/models/Session.ts
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import mongoose from 'mongoose';

export const zSession = z.object({
    _id: z.uuid('Must be a UUID'),
    userId: z.uuid('Must be a UUID'),
    expiresAt: z.date()
});

const sessionModels = getTypesFor('Session', zSession, { timestamps: true, collection: 'session' }, {}, [
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
]);

export default sessionModels;
export type Session = z.infer<typeof zSession>;
export type SessionType = mongoose.InferRawDocType<Session>;
export type SessionDocument = mongoose.HydratedDocument<SessionType>;
export const SessionModel = sessionModels.model;
