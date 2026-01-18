// src/utils/http.ts
import z from 'zod';
import { $ctor, Result } from '../types/game';

export const listWhisperTopicsInput = z.object({
    gameId: z.string().min(1),
    userId: z.string().min(1),
    role: z.enum(['storyteller', 'player', 'spectator'])
});

const success = <T>(obj: T): Result<T> => $ctor.success(obj, 'OK');
const created = <T>(obj: T): Result<T> => $ctor.success(obj, 'CREATED');
const unauthorized = <T>(msg?: string): Result<T> => $ctor.failure('UNAUTHORIZED', msg);
const notFound = <T>(msg?: string): Result<T> => $ctor.failure('NOT_FOUND', msg);
const forbidden = <T>(msg?: string): Result<T> => $ctor.failure('FORBIDDEN', msg);
const badRequest = <T>(msg?: string): Result<T> => $ctor.failure('BAD_REQUEST', msg);

const $response = {
    success,
    created,
    forbidden,
    badRequest,
    notFound,
    unauthorized
};

export { success, created, forbidden, badRequest, notFound, unauthorized };

export default $response;
