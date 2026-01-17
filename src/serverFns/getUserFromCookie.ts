// src/serverFns/getUserFromCookie.ts
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { env } from '../env';
import $session from './$session';
import $user from './$user';

export const getUserFromCookie = createServerFn({
    method: 'GET'
}).handler(async () => {
    const sessionId = getCookie(env.SESSION_COOKIE_NAME);
    if (!sessionId) {
        return null;
    }
    const session = await $session.findOne(sessionId);
    if (!session) {
        return null;
    }
    const user = await $user.findById(session.userId);
    if (!user) {
        return null;
    }
    return { _id: user._id, name: user.name, email: user.email, userRoles: user.userRoles };
});
