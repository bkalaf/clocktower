// src/schemas/enums/zMatchPhase.ts
import z from 'zod/v4';

export const zMatchPhase = z.enum(['day', 'night']);
