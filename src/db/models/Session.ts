// src/db/models/Session.ts
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import refs from '../../schemas/refs';
import aliases from '../../schemas/aliases';

export const zSession = z.object({
    _id: aliases.sessionId,
    userId: refs.user,
    expiresAt: z.date()
});

const sessionModels = getTypesFor('session', zSession, { timestamps: true, collection: 'session' }, {}, [
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
]);

export const SessionModel = sessionModels.model;
