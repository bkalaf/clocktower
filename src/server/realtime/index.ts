// src/server/realtime/index.ts
import z from 'zod';

export const zJoinGame = z.object({
    t: z.literal('joinGame'),
    gameId: z.string().min(1),
    lastStreamIds: z.record(z.string(), z.string()).optional()
});

export type JoinGameMsg = z.infer<typeof zJoinGame>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublishFn = (topic: string, msg: any) => Promise<void> | void;

export type HostGraceDeps = {
    publish?: PublishFn;
};
