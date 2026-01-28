// src/serverFns/getId/getUserFromCookie.ts
import { createServerFn } from '@tanstack/react-start';
import $session from '../session';
import { getSessionCookie } from '../../server/auth/cookies';
import { connectMongoose } from '../../db/connectMongoose';
import type { AuthedUser } from '../../types/game';

export const getUserFromCookie = createServerFn<'GET', AuthedUser | null>({
    method: 'GET'
}).handler(async () => {
    await connectMongoose();
    const sessionId = getSessionCookie();
    if (sessionId) {
        const session = await $session.findOne(sessionId);
        if (session.userId) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (session.userId as any).toObject();
        }
    }
    return null;
});
