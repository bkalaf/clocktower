// src/schemas/aliases/zPassword.ts
import z from 'zod/v4';

export const zPassword = z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password should not exceed 64 characters');
