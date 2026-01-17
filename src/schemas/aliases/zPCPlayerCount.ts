// src/schemas/aliases/zPCPlayerCount.ts
import z from 'zod/v4';


export const zPCPlayerCount = z.union(
    [
        z.literal(5),
        z.literal(6),
        z.literal(7),
        z.literal(8),
        z.literal(9),
        z.literal(10),
        z.literal(11),
        z.literal(12),
        z.literal(13),
        z.literal(14),
        z.literal(15)
    ],
    'Must bebettwen 5 and 15'
);
