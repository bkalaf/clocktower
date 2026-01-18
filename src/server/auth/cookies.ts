// src/server/auth/cookies.ts
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server';
import { env } from '../../env';
import { SessionId } from '../../types/game';

export const SESSION_TTL_DAYS = 14;

export function cookieName() {
    return env.SESSION_COOKIE_NAME;
}

type SameSite = true | false | 'lax' | 'strict' | 'none' | undefined;

export function setSessionCookie(
    sessionId: SessionId,
    expiresAt: number | Date,
    path = '/',
    sameSite: SameSite = 'lax',
    httpOnly = true
) {
    const secure = process.env.NODE_ENV === 'production';
    const expires = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
    setCookie(cookieName(), sessionId, { httpOnly, secure, path, sameSite, expires });
}

export function clearSessionCookie(path = '/', sameSite: SameSite = 'lax', httpOnly = true) {
    const expires = new Date(0);
    const secure = process.env.NODE_ENV === 'production';
    deleteCookie(cookieName(), { httpOnly, secure, path, sameSite, expires });
}

export function getSessionCookie() {
    return getCookie(cookieName());
}
