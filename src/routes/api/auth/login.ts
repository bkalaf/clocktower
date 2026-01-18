// src/routes/api/auth/login.ts
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { parseJsonBody } from '../../../server/parseJsonBody';
import { connectMongoose } from '../../../db/connectMongoose';
import { UserModel } from '../../../db/models/User';
import { HttpError } from '../../../errors';
import { verifyPassword } from '../../../server/auth/password';
import { createSession } from '../../../server/session/createSession';
import { setSessionCookie } from '../../../server/auth/cookies';

const loginBodySchema = z.object({
    email: z.email().min(1),
    password: z.string().min(8).max(64)
});

export const Route = createFileRoute('/api/auth/login')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                await connectMongoose();
                const body = await parseJsonBody(request, loginBodySchema);
                if (!body.ok) {
                    return HttpError.BAD_REQUEST_RESPONSE('Invalid JSON', body.response);
                }
                const { email, password } = body.data;
                const user = await UserModel.findOne({ email: email.toLowerCase() });

                if (!user) {
                    return HttpError.UNAUTHORIZED_RESPONSE('Could not find user', { email });
                }
                const ok = await verifyPassword(password, user.passwordHash);
                if (!ok) {
                    return HttpError.UNAUTHORIZED_RESPONSE('invalid credentials', { email });
                }

                const session = await createSession(user._id);
                const headers = new Headers();
                setSessionCookie(session.sessionId, session.expiresAt);
                return new Response(JSON.stringify({ ok: true }), {
                    status: 200,
                    headers
                });
            }
        }
    }
});
