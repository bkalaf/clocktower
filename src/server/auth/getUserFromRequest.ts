// src/server/auth/getUserFromRequest.ts
import { connectMongoose } from '../../db/connectMongoose';
import { SessionModel } from '../../db/models/Session';
import { UserModel } from '../../db/models/User';
import { HttpError } from '../../errors';
import { parseCookie } from '../parseCookie';
import { cookieName } from './session';

export async function getUserFromRequest(request: Request) {
    await connectMongoose();

    const sessionId = parseCookie(request.headers.get('cookie'), cookieName());
    if (!sessionId) return HttpError.BAD_REQUEST_RESPONSE('No sessionId');

    const now = new Date().valueOf();
    const session = await SessionModel.findOne({ _id: sessionId, expiresAt: { $gt: now } }).lean();
    if (!session) return HttpError.BAD_REQUEST_RESPONSE('No session found.');

    const user = await UserModel.findById(session.userId).lean();
    if (!user) return HttpError.UNAUTHORIZED_RESPONSE('user not found');

    return { userId: user._id, name: user.name, email: user.email, roles: user.roles };
}
