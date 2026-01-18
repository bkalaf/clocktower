// src/schemas/enums/zMatchStatus.ts
import z from 'zod/v4';

export const zMatchStatus = z.enum(['setup', 'in_progress', 'reveal', 'complete']);
