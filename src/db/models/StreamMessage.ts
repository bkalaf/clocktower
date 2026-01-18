// src/db/models/StreamMessage.ts
import z from 'zod/v4';
import mongoose from 'mongoose';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';

const { aliases, refs } = schemas;

export const zStreamMessage = z.object({
    _id: aliases.chatItemId,
    gameId: refs.game,
    topicId: z.string().min(1),
    streamId: refs.stream,
    ts: aliases.timestamp,
    kind: z.enum(['event', 'snapshot']),
    message: z.unknown()
});

const streamMessageModels = getTypesFor(
    'stream_message',
    zStreamMessage,
    { timestamps: { createdAt: 'ts', updatedAt: 'updatedAt' }, collection: 'stream_message' },
    {},
    [{ topicId: 1 }],
    [{ streamId: 1 }],
    [{ gameId: 1 }]
);

export type StreamMessage = z.infer<typeof zStreamMessage>;
export type StreamMessageType = mongoose.InferRawDocType<StreamMessage>;
export type StreamMessageDocument = mongoose.HydratedDocument<StreamMessageType>;
export const StreamMessageModel = streamMessageModels.model;
export default streamMessageModels;
