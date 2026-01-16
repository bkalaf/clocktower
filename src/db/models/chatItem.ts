// src/db/models/chatItem.ts
import mongoose, { Schema } from 'mongoose';
import { ChatItem } from '../../types/game';

const chatItemSchema = new Schema<ChatItem>(
    {
        _id: { type: String, required: true },
        gameId: { type: String, required: true, minLength: 16, index: true },
        topicId: { type: String, required: true, minLength: 16, index: true },
        from: {
            userId: { type: String, required: true, minLength: 16 },
            name: { type: String, required: true }
        },
        text: { type: String, required: true },
        ts: { type: Number, required: true },
        streamId: { type: String, required: true, minLength: 16 }
    },
    {
        timestamps: true
    }
);

chatItemSchema.index({ gameId: 1, ts: -1 });

export const ChatItemModel =
    (mongoose.models['ChatItem'] as mongoose.Model<ChatItem>) || mongoose.model<ChatItem>('ChatItem', chatItemSchema);
