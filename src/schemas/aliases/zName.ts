// src/schemas/aliases/zName.ts
import z from 'zod/v4';

export const zName = z.string().min(1, 'Field is required');
