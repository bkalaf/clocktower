// src/schemas/aliases/zEmail.ts
import z from 'zod/v4';

export const zEmail = z
    .email('Invalid email')
    .min(1, 'This field is required')
    .max(128, 'Maximum length is 128 characters.');
