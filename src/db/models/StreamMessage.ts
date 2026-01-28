// src/db/models/StreamMessage.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';

const { aliases, refs } = schemas;

export interface StreamMessage {
    _id: string;
    gameId: string;
    topicId: string;
    streamId: string;
    ts: Date;
    kind: 'event' | 'snapshot';
    message: unknown;
}

export const zStreamMessage = z
    .object({
        _id: aliases.chatItemId,
        gameId: refs.game,
        topicId: z.string().min(1),
        streamId: refs.stream,
        ts: aliases.timestamp,
        kind: z.enum(['event', 'snapshot']),
        message: z.unknown()
    })
    .satisfies<z.ZodType<StreamMessage>>();

export type StreamMessageType = mongoose.InferRawDocType<StreamMessage>;
export type StreamMessageDocument = mongoose.HydratedDocument<StreamMessageType>;

const kindOptions = ['event', 'snapshot'] as const;

const streamMessageSchema = new mongoose.Schema<StreamMessage>(
    {
        _id: { type: String, required: true },
        gameId: { type: String, required: true },
        topicId: { type: String, required: true },
        streamId: { type: String, required: true },
        ts: { type: Date, required: true },
        kind: { type: String, required: true, enum: kindOptions },
        message: { type: mongoose.Schema.Types.Mixed, required: true }
    },
    {
        timestamps: { createdAt: 'ts', updatedAt: 'updatedAt' },
        collection: 'stream_message'
    }
);

streamMessageSchema.index({ topicId: 1 });
streamMessageSchema.index({ streamId: 1 });
streamMessageSchema.index({ gameId: 1 });

const modelName = 'stream_message';
const existingModel = mongoose.models[modelName] as mongoose.Model<StreamMessage> | undefined;
export const StreamMessageModel =
    existingModel ?? mongoose.model<StreamMessage>(modelName, streamMessageSchema);

const streamMessageModels = {
    schema: streamMessageSchema,
    model: StreamMessageModel,
    insert: zStreamMessage
};

export default streamMessageModels;
