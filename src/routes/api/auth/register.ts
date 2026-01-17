// src/routes/api/auth/register.ts
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { hashPassword } from '../../../server/auth/password';
import { randomUUID } from 'crypto';
import { parseJsonBody } from '../../../server/parseJsonBody';
import { connectMongoose } from '../../../db/connectMongoose';
import { UserModel } from '../../../db/models/User';
import { HttpError } from '../../../errors';
import { createSession } from '../../../server/session/createSession';
import { setSessionCookie } from '../../../server/auth/session';

const RegisterBodySchema = z
    .object({
        email: z.email().min(1),
        name: z.string().min(1).max(64),
        password: z.string().min(8).max(200),
        verificationPassword: z.string().min(8).max(200)
    })
    .refine((check) => check.password === check.verificationPassword, {
        message: `The verification password and password do not match.`,
        path: ['verificationPassword']
    });

export const Route = createFileRoute('/api/auth/register')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                const b = await parseJsonBody(request, RegisterBodySchema);
                if (!b.ok) {
                    return b.response;
                }
                const body = b.data;

                await connectMongoose();
                const existing = await UserModel.findOne({ email: body.email.toLowerCase() }).lean();
                if (existing) {
                    return HttpError.CONFLICT_RESPONSE('Email already in use', existing);
                }

                const userId = randomUUID();
                const passwordHash = await hashPassword(body.password);

                const doc = await UserModel.create({
                    _id: userId,
                    email: body.email.toLowerCase(),
                    name: body.name,
                    passwordHash,
                    userRoles: ['user']
                });

                const { sessionId, expiresAt } = await createSession(userId);
                const headers = new Headers({
                    'Content-Type': 'application/json'
                });
                setSessionCookie(headers, sessionId, expiresAt);

                return new Response(
                    JSON.stringify({
                        ok: true,
                        userId: doc._id,
                        name: doc.name,
                        email: doc.email,
                        userRoles: doc.userRoles
                    }),
                    {
                        status: 200,
                        headers
                    }
                );
            }
        }
    }
});
