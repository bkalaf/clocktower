// src/serverFns/$session.ts
import { createServerFn } from '@tanstack/react-start';
import { connectMongoose } from '../db/connectMongoose';
import { SessionModel } from '../db/models/Session';
import { clearSessionCookie, getSessionCookie } from '../server/auth/cookies';
import { AuthedUser, SessionId } from '../types/game';
import $models from '../db/models';
import { PopulatedDoc } from 'mongoose';

export interface ISession<T> {
    _id: string;
    userId: T;
    expiresAt: Date;
}

// TODO change to server fn
const findOne = async (_id: SessionId, expiresAt: number = Date.now()) => {
    await connectMongoose();
    const res = (await $models.SessionModel.findOne({ _id, expiresAt: { $gt: expiresAt } }).populate(
        'userId'
    )) as ISession<PopulatedDoc<AuthedUser>>;
    if (res.userId && typeof res.userId !== 'string') {
        return res as ISession<AuthedUser>;
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
