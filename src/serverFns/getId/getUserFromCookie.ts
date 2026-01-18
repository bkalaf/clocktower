// src/serverFns/getId/getUserFromCookie.ts
import { createServerFn } from '@tanstack/react-start';
import $session from '../$session';
import { getSessionCookie } from '../../server/auth/cookies';

export const getUserFromCookie = createServerFn({
    method: 'GET'
}).handler(async () => {
    const sessionId = getSessionCookie();
    if (sessionId) {
        const session = await $session.findOne(sessionId);
        if (session.userId) {
            return session.userId;
        }
    }
    throw new Error(`no sessionId`);
});
