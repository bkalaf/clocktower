// src/schemas/aliases/zModerationLogId.ts
import z from 'zod/v4';

export const zModerationLogId = z.uuid('ModerationLogId must be a UUID');
