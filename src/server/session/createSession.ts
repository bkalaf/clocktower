// src/server/session/createSession.ts
import { randomUUID } from 'crypto';
import { connectMongoose } from '../../db/connectMongoose';
import { SessionModel } from '../../db/models/Session';
import { SESSION_TTL_DAYS } from '../auth/cookies';

export async function createSession(userId: string) {
    await connectMongoose();

    const sessionId = randomUUID().toString();
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    const doc = await SessionModel.create({
        _id: sessionId,
        userId,
        expiresAt: expiresAt.valueOf()
    });

    return { expiresAt: doc.expiresAt, sessionId };
}
