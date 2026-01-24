// src/schemas/enums/zNightSubphase.ts
import z from 'zod/v4';

export const zNightSubphase = z.enum(['night.first_night', 'night.other_night']);
