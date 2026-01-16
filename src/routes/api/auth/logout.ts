// src/routes/api/auth/logout.ts
import { createFileRoute } from '@tanstack/react-router';
import { clearSessionCookie, deleteSession, getSessionIdFromRequest } from '../../../server/auth/session';

export const Route = createFileRoute('/api/auth/logout')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                const sessionId = getSessionIdFromRequest(request);

                // Delete server-side session if it exists
                if (sessionId) {
                    await deleteSession(sessionId).catch(() => {});
                }

                // Clear client-side cookie
                const headers = new Headers();
                clearSessionCookie(headers);
                return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
            }
        }
    }
});
