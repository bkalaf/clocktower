// src/schemas/aliases/zSessionId.ts
import z from 'zod/v4';

export const zSessionId = z.uuid('SessionId must be UUID');
