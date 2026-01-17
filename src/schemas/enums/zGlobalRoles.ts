// src/schemas/enums/zGlobalRoles.ts
import z from 'zod/v4';

export const zGlobalRoles = z.enum(['moderator', 'user', 'admin']);
