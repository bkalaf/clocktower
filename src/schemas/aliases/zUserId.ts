// src/schemas/aliases/zUserId.ts
import z from 'zod/v4';

export const zUserId = z.uuid('UserId must be UUID');
