// src/routes/api/dev/grimoire.ts
import { createFileRoute } from '@tanstack/react-router';
import { env } from '../../../env';
import { parseCookie } from '../../../server/parseCookie';
import { cookieName } from '../../../server/auth/cookies';
import $session from '../../../serverFns/$session';
import { requireStoryteller } from '../../../server/authz/gameAuth';

const respond = (payload: unknown, status = 200) => Response.json(payload, { status });

export const Route = createFileRoute('/api/dev/grimoire')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                if (process.env.NODE_ENV === 'production') {
                    return Response.json({ error: 'not_found' }, { status: 404 });
                }
                if (env.ALLOW_DEV_GRIMOIRE !== 'true') {
                    return Response.json({ error: 'forbidden' }, { status: 403 });
                }

                const cookieHeader = request.headers.get('cookie');
                const sessionId = parseCookie(cookieHeader, cookieName());
                if (!sessionId) {
                    return respond({ error: 'unauthorized' }, 401);
                }

                let session;
                try {
                    session = await $session.findOne(sessionId);
                } catch {
                    return respond({ error: 'unauthorized' }, 401);
                }

                const user = session.userId;

                const url = new URL(request.url);
                const roomId = url.searchParams.get('roomId');
                const matchId = url.searchParams.get('matchId');
                if (!roomId || !matchId) {
                    return respond({ error: 'missing_params' }, 400);
                }

                const isAdmin = Array.isArray(user.userRoles) && user.userRoles.includes('admin');
                if (!isAdmin) {
                    try {
                        await requireStoryteller(roomId, user);
                    } catch {
                        return respond({ error: 'forbidden' }, 403);
                    }
                }

                const grimoire = { roomId, matchId, debug: 'TODO: return real grimoire' };
                return respond({ grimoire });
            }
        }
    }
});
