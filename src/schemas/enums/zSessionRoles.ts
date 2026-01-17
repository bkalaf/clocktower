// src/schemas/enums/zSessionRoles.ts
import z from 'zod/v4';

export const zSessionRoles = z.enum(['player', 'storyteller', 'spectator']);
