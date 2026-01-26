// src/server/realtime/index.ts
import z from 'zod/v4';

export const zJoinGame = z.object({
    t: z.literal('joinGame'),
    gameId: z.string().min(1),
    lastStreamIds: z.record(z.string(), z.string()).optional()
});

export const zJoinTopic = z.object({
    t: z.literal('joinTopic'),
    topicId: z.string().min(1)
});

export const zChat = z.object({
    t: z.literal('chat'),
    topicId: z.string().min(1),
    text: z.string().min(1)
});

export const zPing = z.object({
    t: z.literal('ping')
});

export type JoinGameMsg = z.infer<typeof zJoinGame>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublishFn = (topic: string, msg: any) => Promise<void> | void;

export type HostGraceDeps = {
    publish?: PublishFn;
};
