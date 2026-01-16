/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/http.ts
import z from 'zod';
import { safeStringify } from './safeStringify';

export const listWhisperTopicsInput = z.object({
    gameId: z.string().min(1),
    userId: z.string().min(1),
    role: z.enum(['storyteller', 'player', 'spectator'])
});
export const success = (obj: any) => {
    console.log(`safeStringify`, safeStringify(obj))
    return Response.json(obj, {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
export const created = (obj: any) => {
    return Response.json(safeStringify(obj), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};
export const notFound = () =>
    Response.json(
        { error: 'Not Found.' },
        {
            status: 404,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

export const unauthorized = () =>
    Response.json(
        { error: 'Unauthorized' },
        {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

export const forbidden = () =>
    Response.json(
        { error: 'Forbidden' },
        {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

export const badRequest = (msg: string) =>
    Response.json(
        { error: msg },
        {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
