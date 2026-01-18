// src/schemas/enums/zRoomVisibility.ts
import z from 'zod/v4';

export const zRoomVisibility = z.enum(['public', 'private']);
