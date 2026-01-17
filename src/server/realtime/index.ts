// src/server/realtime/index.ts
import z from 'zod';

export const zJoinGame = z.object({
    t: z.literal('joinGame'),
    gameId: z.string().min(1),
    lastStreamIds: z.record(z.string(), z.string()).optional()
});

export type JoinGameMsg = z.infer<typeof zJoinGame>;
