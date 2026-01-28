// src/serverFns/session.ts
import { createServerFn } from '@tanstack/react-start';
import { connectMongoose } from '../db/connectMongoose';
import { SessionModel } from '../db/models/Session';
import { clearSessionCookie, getSessionCookie } from '../server/auth/cookies';
import { AuthedUser, SessionId } from '../types/game';
import $models from '../db/models';

export interface ISession<T> {
    _id: string;
    userId: T;
    expiresAt: Date;
}

// TODO change to server fn
const findOne = async (_id: SessionId, expiresAt: number = Date.now()) => {
    await connectMongoose();
    // console.log(`_id`, _id);
    // console.log(`expiresAt`, expiresAt);
    const res = await $models.SessionModel.findOne({ _id, expiresAt: { $gt: new Date(expiresAt) } }).populate(
        'userId',
        '_id username email userRoles settings'
    );
    // console.log(`res`, res);
    if (res?.userId && typeof res?.userId !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return res as any as ISession<AuthedUser>;
    }
    throw new Error(`could not populate userId`);
};

const deleteById = createServerFn({
    method: 'GET'
}).handler(async () => {
    const sessionId = getSessionCookie();
    if (!sessionId) throw new Error('no session to delete');
    await connectMongoose();
    await SessionModel.deleteOne({ _id: sessionId });
    clearSessionCookie();
});

const $session = {
    findOne,
    deleteById
};

export default $session;
