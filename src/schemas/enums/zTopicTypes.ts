// src/schemas/enums/zTopicTypes.ts
import z from 'zod/v4';

export const zTopicTypes = z.enum(['public', 'st', 'whisper']);
