// src/routes/api/auth/session.ts

import { createFileRoute } from '@tanstack/react-router';
import { clearSessionCookie, deleteSession, getSessionIdFromRequest } from '../../../server/auth/session';
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { env } from '../../../env';

export const deleteOneSession = createServerFn({
    method: 'POST'
}).handler(async () => {
    const sessionId = getCookie(env.SESSION_COOKIE_NAME);
    if (!sessionId) return null;
    await delete
    const headers = new Headers();
    clearSessionCookie(headers);

})
export const Route = createFileRoute('/api/auth/session')({
    server: {
        handlers: {
            DELETE: async ({ request }) => {
                const sessionId = getSessionIdFromRequest(request);
                if (sessionId) await deleteSession(sessionId).catch(() => {});

                const headers = new Headers();
                clearSessionCookie(headers);

                return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
            }
        }
    }
});
