// src/schemas/enums/zGameStatus.ts
import z from 'zod/v4';

export const zGameStatus = z.enum(['idle', 'playing', 'reveal', 'setup', 'ended']);
