// src/server/getUserFromReq.ts
import { connectMongoose } from '../db/connectMongoose';
import { SessionModel } from '../db/models/Session';
import { UserModel } from '../db/models/User';
import { env } from '../env';
import { $STATUS_CODES, HttpError } from '../errors';
import { parseCookie } from './parseCookie';

/**
* @deprecated
*/
export async function getUserFromReq(req: Request): Promise<Response> {
    if (!req.headers.has('cookie')) {
        return HttpError.BAD_REQUEST_RESPONSE('No cookie.');
    }
    const cookie = req.headers.get('cookie') as string;
    console.log(`cookie`, cookie);
    const sessionId = parseCookie(req.headers.get('cookie') as string, env.SESSION_COOKIE_NAME);
    if (!sessionId) {
        return HttpError.UNAUTHORIZED_RESPONSE('No sessionId');
    }

    await connectMongoose();

    const now = Date.now();
    const session = await SessionModel.findOne({ _id: sessionId, expiresAt: { $gt: now } }).lean();
    if (!session) {
        return HttpError.UNAUTHORIZED_RESPONSE('No session');
    }

    const user = await UserModel.findById(session.userId).lean();
    if (!user) {
        return HttpError.UNAUTHORIZED_RESPONSE('No user');
    }

    return success({ _id: user._id, name: user.name, email: user.email, userRoles: user.userRoles });
}

