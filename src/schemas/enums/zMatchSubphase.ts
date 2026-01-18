// src/schemas/enums/zMatchSubphase.ts
import z from 'zod/v4';
import { zDaySubphase } from './zDaySubphase';
import { zNightSubphase } from './zNightSubphase';

const dayVariants = zDaySubphase.options.map((item) => z.literal(`day.${item}` as const));

export const zMatchSubphase = z.union([z.literal('night.resolve_night_order'), ...dayVariants]);
