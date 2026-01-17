// src/schemas/aliases/zTopicId.ts
import z from 'zod/v4';

export const zTopicId = z.uuid('SessionId must be UUID');
