// src/schemas/enums/zRoomStatus.ts
import z from 'zod/v4';

export const zRoomStatus = z.enum(['open', 'closed', 'in_match', 'archived']);
