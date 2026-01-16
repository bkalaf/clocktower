// src/server/parseParams.ts

import { z } from 'zod';
import type { ParseOk, ParseErr } from './parseJsonBody';
import { HttpError } from '../errors';

/**
 * Validate route params with a Zod schema.
 * Returns either { ok: true, data } or { ok: false, response } (400).
 */
export function parseParams<TSchema extends z.ZodTypeAny>(
    params: unknown,
    schema: TSchema
): ParseOk<z.infer<TSchema>> | ParseErr {
    const parsed = schema.safeParse(params);

    if (!parsed.success) {
        return {
            ok: false,
            response: HttpError.BAD_REQUEST_RESPONSE('Invalid Params', { issues: parsed.error.issues })
        };
    }

    return { ok: true, data: parsed.data };
}
