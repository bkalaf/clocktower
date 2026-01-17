// src/schemas/enums/zSkillLevel.ts
import z from 'zod/v4';


export const zSkillLevel = z.enum(['novice', 'intermediate', 'advanced', 'expert']);
