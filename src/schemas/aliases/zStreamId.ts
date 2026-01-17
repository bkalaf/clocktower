// src/schemas/aliases/zStreamId.ts
import z from 'zod/v4';

export const zStreamId = z.uuid('StreamId must be UUID');
