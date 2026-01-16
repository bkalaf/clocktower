// src/server/auth/session.ts
import { connectMongoose } from '../../db/connectMongoose';
import { SessionModel } from '../../db/models/Session';
import { env } from '../../env';
import { parseCookie } from '../parseCookie';

export const SESSION_TTL_DAYS = 14;

export function cookieName() {
    return env.SESSION_COOKIE_NAME;
}

export function setSessionCookie(headers: Headers, sessionId: string, expiresAt: number) {
    // HttpOnly means JS can’t steal it. SameSite=Lax is a sane default for dev.
    // Secure should be on in prod HTTPS.
    const date = new Date(expiresAt);
    const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    headers.append(
        'Set-Cookie',
        `${cookieName()}=${encodeURIComponent(sessionId)}; ${secure}HttpOnly; Path=/; SameSite=Lax; Expires=${date.toUTCString()}`
    );
}

export function clearSessionCookie(headers: Headers) {
    const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    headers.append(
        'Set-Cookie',
        `${cookieName()}=; ${secure}HttpOnly; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    );
}

export function getSessionIdFromRequest(request: Request): string | null {
    return parseCookie(request.headers.get('cookie'), cookieName());
}

export async function deleteSession(sessionId: string) {
    await connectMongoose();
    await SessionModel.deleteOne({ _id: sessionId });
}
