// src/schemas/aliases/zChatItemId.ts
import z from 'zod/v4';

export const zChatItemId = z.uuid('ChatItemId must be a UUID');
