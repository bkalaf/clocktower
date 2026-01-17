// src/schemas/aliases/zVersion.ts
import z from 'zod/v4';

export const zVersion = z.int().min(0, 'Version must be greater than or equal to 0').default(1);
