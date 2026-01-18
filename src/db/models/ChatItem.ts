// src/db/models/ChatItem.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { refs, aliases, enums } = schemas;

export const zChatItem = z.object({
    _id: aliases.chatItemId,
    gameId: refs.game,
    topicId: refs.topic,
    from: z
        .object({
            userId: aliases.userId,
            name: aliases.name.meta({ description: 'The displayed name of the sender.' })
        })
        .optional()
        .nullable(),
    text: z.string(),
    streamId: refs.stream,
    ts: aliases.timestamp
});

const chatItemModels = getTypesFor(
    'chat_item',
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
