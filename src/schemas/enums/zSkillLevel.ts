// src/schemas/enums/zSkillLevel.ts
import z from 'zod/v4';

export const zSkillLevel = z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'veteran']);
