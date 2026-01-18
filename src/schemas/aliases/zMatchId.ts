// src/schemas/aliases/zMatchId.ts
import z from 'zod/v4';

export const zMatchId = z.uuid('MatchId must be a UUID');
