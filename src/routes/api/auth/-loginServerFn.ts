// src/routes/api/auth/-loginServerFn.ts
import z from 'zod/v4';
import { connectMongoose } from '../../../db/connectMongoose';
import { UserModel } from '../../../db/models/User';
import { verifyPassword } from '../../../server/auth/password';
import { createSession } from '../../../server/session/createSession';
import { setSessionCookie } from '../../../server/auth/cookies';
import { createServerFn } from '@tanstack/react-start';
import { createSessionActor } from '../../../server/sessionService';
import type { AuthedUser } from '../../../types/game';

const loginBodySchema = z.object({
    email: z.email().min(1),
    password: z.string().min(8).max(64)
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unauthorized(msg: string, payload: any) {
    return new Response(JSON.stringify({ ok: false, msg, payload }), {
        status: 401
    });
}

type LoginSuccessResponse = { ok: true; user: AuthedUser };
type LoginResponse = Response | LoginSuccessResponse;

export const loginServerFn = createServerFn<'POST', LoginResponse>({
    method: 'POST'
})
    .inputValidator(loginBodySchema)
    .handler(async ({ data }) => {
        await connectMongoose();
        const { email, password } = data;
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return unauthorized('Could not find user', { email });
        }
        const ok = await verifyPassword(password, user.passwordHash, {
            onUpgrade: async (newHash) => {
                await UserModel.updateOne({ _id: user._id }, { passwordHash: newHash }).exec();
            }
        });
        if (!ok) {
            return unauthorized('invalid credentials', { email });
        }
        const session = await createSession(user._id);
        setSessionCookie(session.sessionId, session.expiresAt);
        createSessionActor(session.sessionId);
        return {
            ok: true,
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                avatarPath: user.avatarPath,
                userRoles: user.userRoles,
                settings: user.settings
            }
        };
    });

// export const Route = createFileRoute('/api/auth/login')({
//     server: {
//         handlers: {
//             POST: async ({ request }) => {
//                 await connectMongoose();
//                 const body = await parseJsonBody(request, loginBodySchema);
//                 if (!body.ok) {
//                     return HttpError.BAD_REQUEST_RESPONSE('Invalid JSON', body.response);
//                 }
//                 const { email, password } = body.data;
//                 const user = await UserModel.findOne({ email: email.toLowerCase() });

//                 if (!user) {
//                     return HttpError.UNAUTHORIZED_RESPONSE('Could not find user', { email });
//                 }
//                 const ok = await verifyPassword(password, user.passwordHash);
//                 if (!ok) {
//                     return HttpError.UNAUTHORIZED_RESPONSE('invalid credentials', { email });
//                 }

//                 const session = await createSession(user._id);
//                 const headers = new Headers();
//                 setSessionCookie(session.sessionId, session.expiresAt);
//                 return new Response(JSON.stringify({ ok: true }), {
//                     status: 200,
//                     headers
//                 });
//             }
//         }
//     }
// });
