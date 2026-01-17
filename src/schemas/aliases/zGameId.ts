// src/schemas/aliases/zGameId.ts
import z from 'zod/v4';

export const zGameId = z.uuid('GameId must be UUID');
