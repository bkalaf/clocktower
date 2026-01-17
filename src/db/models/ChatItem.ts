// src/db/models/ChatItem.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';

const zChatItem = z.object({
    _id: z.uuid('Must be a UUID'),
    gameId: z.uuid('Must be a UUID'),
    topicId: z.uuid('Must be a UUID'),
    from: z.object({
        userId: z.uuid('Must be a UUID'),
        name: z
            .string()
            .min(3, 'Must be over 3 characters long')
            .max(64, 'Must be under 64 characters')
            .meta({ description: 'The displayed name of the sender.' })
    }),
    text: z.string(),
    streamId: z.uuid('Must be a UUID')
});

const chatItemModels = getTypesFor(
    'ChatItem',
    zChatItem,
    { timestamps: { createdAt: 'ts', updatedAt: 'updatedAt' }, collection: 'chat_item' },
    {},
    [{ gameId: 1, ts: -1 }],
    [{ topicId: 1 }],
    [{ streamId: 1 }]
);

export type ChatItem = z.infer<typeof zChatItem>;
export type ChatItemType = mongoose.InferRawDocType<ChatItem>;
export type ChatItemDocument = mongoose.HydratedDocument<ChatItemType>;
export const ChatItemModel = chatItemModels.model;
export default chatItemModels;
