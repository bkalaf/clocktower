// src/routes/api/auth/session.ts

import { createFileRoute } from '@tanstack/react-router';
import { clearSessionCookie, deleteSession, getSessionIdFromRequest } from '../../../server/auth/session';

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
