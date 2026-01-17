// src/schemas/aliases/zPCTravelerCount.ts
import z from 'zod/v4';

export const zPCTravelerCount = z.union(
    [z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)],
    'Traveler count must be 5 or under'
);
