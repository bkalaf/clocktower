// src/schemas/aliases/zGameMemberId.ts
import z from 'zod/v4';

export const zGameMemberId = z.uuid('GameMemberId must be UUID');
