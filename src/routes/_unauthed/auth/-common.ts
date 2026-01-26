// src/routes/_unauthed/auth/-common.ts
import { z } from 'zod';

export const authReturnToSearchSchema = z.object({
    returnTo: z.string().optional()
});

export function normalizeReturnTo(value?: string) {
    if (typeof value === 'string' && value.startsWith('/')) {
        return value;
    }
    return '/';
}
