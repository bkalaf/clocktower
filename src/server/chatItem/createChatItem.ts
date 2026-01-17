// src/server/chatItem/createChatItem.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { ChatItemModel } from '@/db/models/ChatItem';
import { created } from '../../utils/http';

const chatItemInputSchema = z.object({
    _id: z.string().min(1),
    gameId: z.string().min(1),
    topicId: z.string().min(1),
    text: z.string().optional().nullable(),
    ts: z.union([z.date(), z.int()]),
    streamId: z.string().min(1),
    from: z.string().min(1),
    name: z.string().min(1)
});
export const createChatItem = createServerFn({
    method: 'POST'
})
    .inputValidator((data) => chatItemInputSchema.parse(data))
    .handler(async ({ data }) => {
        const doc = await ChatItemModel.create({
            _id: data._id,
            gameId: data.gameId,
            text: data.text ?? '',
            topicId: data.topicId,
            ts: data.ts instanceof Date ? data.ts.valueOf() : data.ts,
            streamId: data.streamId,
            from: { userId: data.from, name: data.name }
        });
        return created(doc);
    });
