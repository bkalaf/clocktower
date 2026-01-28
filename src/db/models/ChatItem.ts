// src/db/models/ChatItem.ts
import mongoose, { Schema } from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';
import type { GameId, StreamId, TopicId, UserId } from '../../types/game';

const { aliases, refs } = schemas;

export type ChatItemFrom = {
    userId: UserId;
    name: string;
};

export interface ChatItem {
    _id: string;
    gameId: GameId;
    topicId: TopicId;
    from?: ChatItemFrom | null;
    text: string;
    streamId: StreamId;
    ts: Date;
}

export const zChatItem = z
    .object({
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
    })
    .satisfies<z.ZodType<ChatItem>>();

export type ChatItemType = mongoose.InferRawDocType<ChatItem>;
export type ChatItemDocument = mongoose.HydratedDocument<ChatItemType>;

const chatItemSchema = new Schema<ChatItem>(
    {
        _id: { type: String, required: true },
        gameId: { type: String, required: true },
        topicId: { type: String, required: true },
        from: {
            type: new Schema(
                {
                    userId: { type: String, required: true },
                    name: { type: String, required: true }
                },
                { _id: false }
            ),
            required: false,
            default: null
        },
        text: { type: String, required: true },
        streamId: { type: String, required: true },
        ts: { type: Date, required: true }
    },
    {
        timestamps: { createdAt: 'ts', updatedAt: 'updatedAt' },
        collection: 'chat_item'
    }
);

chatItemSchema.index({ gameId: 1, ts: -1 });
chatItemSchema.index({ topicId: 1 });
chatItemSchema.index({ streamId: 1 });

const modelName = 'chat_item';
const existingModel = mongoose.models[modelName] as mongoose.Model<ChatItem> | undefined;
export const ChatItemModel = existingModel ?? mongoose.model<ChatItem>(modelName, chatItemSchema);

const chatItemModels = {
    schema: chatItemSchema,
    model: ChatItemModel,
    insert: zChatItem
};

export default chatItemModels;
