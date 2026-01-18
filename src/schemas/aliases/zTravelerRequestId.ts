// src/schemas/aliases/zTravelerRequestId.ts
import z from 'zod/v4';

export const zTravelerRequestId = z.uuid('TravelerRequestId must be a UUID');
