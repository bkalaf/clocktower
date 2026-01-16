// src/server/getUserFromReq.ts
import { connectMongoose } from '../db/connectMongoose';
import { SessionModel } from '../db/models/session';
import { UserModel } from '../db/models/user';
import { env } from '../env';
import { HttpError } from '../errors';
import { AuthedUser } from '../types/game';
import { parseCookie } from './parseCookie';

export async function getUserFromReq(req: Request): Promise<AuthedUser | null> {
    if (!req.headers.has('cookie')) {
        throw HttpError.BAD_REQUEST('No cookie.');
    }
    const sessionId = parseCookie(req.headers.get('cookie') as string, env.SESSION_COOKIE_NAME);
    if (!sessionId) {
        throw HttpError.UNAUTHORIZED('No sessionId');
    }

    await connectMongoose();

    const now = Date.now();
    const session = await SessionModel.findOne({ _id: sessionId, expiresAt: { $gt: now } }).lean();
    if (!session) {
        throw HttpError.UNAUTHORIZED('No session');
    }

    const user = await UserModel.findById(session.userId).lean();
    if (!user) {
        throw HttpError.UNAUTHORIZED('No user');
    }

    return { _id: user._id, name: user.name, email: user.email, roles: user.roles };
}
