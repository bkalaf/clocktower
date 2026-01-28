import z from 'zod/v4';

export const zPasswordHash = z
    .string()
    .min(8, 'Password hash must be at least 8 characters long')
    .max(512, 'Password hash should not exceed 512 characters');
