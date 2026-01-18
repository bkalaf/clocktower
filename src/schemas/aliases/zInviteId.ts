// src/schemas/aliases/zInviteId.ts
import z from 'zod/v4';

export const zInviteId = z.uuid('InviteId must be a UUID');
