// src/server/parseJsonBody.ts
import { z } from 'zod';
import { HttpError } from '../errors';

export type ParseOk<T> = { ok: true; data: T };
export type ParseErr = { ok: false; response: Response };

/**
 * Parse + validate a JSON request body with a Zod schema.
 * Returns either { ok: true, data } or { ok: false, response } (400).
 */
export async function parseJsonBody<TSchema extends z.ZodTypeAny>(
    request: Request,
    schema: TSchema
): Promise<ParseOk<z.infer<TSchema>> | ParseErr> {
    let raw: unknown;

    try {
        raw = await request.json();
    } catch {
        return {
            ok: false,
            response: HttpError.BAD_REQUEST_RESPONSE('Invalid JSON')
        };
    }

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
        return {
            ok: false,
            response: HttpError.BAD_REQUEST_RESPONSE('Invalid body', { issues: parsed.error.issues })
        };
    }

    return { ok: true, data: parsed.data };
}
