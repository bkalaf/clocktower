// src/schemas/enums/zGameSpeed.ts
import z from 'zod/v4';

export const zGameSpeed = z.enum(['slow', 'moderate', 'fast'] as const);
