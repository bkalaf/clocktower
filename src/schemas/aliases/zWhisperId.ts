// src/schemas/aliases/zWhisperId.ts
import z from 'zod/v4';

export const zWhisperId = z.uuid('SessionId must be UUID');
