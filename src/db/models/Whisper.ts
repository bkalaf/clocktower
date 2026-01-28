// src/db/models/Whisper.ts
import mongoose, { Schema } from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas';
import type { GameId, TopicId, UserId } from '../../types/game';

const { refs, aliases } = schemas;

export interface WhisperMeta {
    name: string;
    includeStoryteller: boolean;
}

export interface Whisper {
    _id: string;
    gameId: GameId;
    topicId: TopicId;
    creatorId: UserId;
    members: UserId[];
    isActive: boolean;
    meta?: WhisperMeta | null;
}

export const zWhisper = z
    .object({
        _id: aliases.whisperId,
        gameId: refs.game,
        topicId: refs.topic,
        creatorId: refs.user,
        members: z.array(refs.user),
        isActive: z.boolean().default(true),
        meta: z
            .object({
                name: aliases.name.meta({ description: 'The displayed name of the channel.' }),
                includeStoryteller: z.boolean().default(true)
            })
            .optional()
            .nullable()
    })
    .satisfies<z.ZodType<Whisper>>();

export type WhisperType = mongoose.InferRawDocType<Whisper>;
export type WhisperDocument = mongoose.HydratedDocument<WhisperType>;

const metaSchema = new Schema(
    {
        name: { type: String, required: true },
        includeStoryteller: { type: Boolean, required: true, default: true }
    },
    { _id: false }
);

const whisperSchema = new Schema<Whisper>(
    {
        _id: { type: String, required: true },
        gameId: { type: String, required: true },
        topicId: { type: String, required: true },
        creatorId: { type: String, required: true },
        members: { type: [String], required: true, default: [] },
        isActive: { type: Boolean, required: true, default: true },
        meta: { type: metaSchema, default: null }
    },
    {
        timestamps: true,
        collection: 'whisper'
    }
);

whisperSchema.index({ gameId: 1, isActive: 1 });

const modelName = 'whisper';
const existingModel = mongoose.models[modelName] as mongoose.Model<Whisper> | undefined;
export const WhisperModel = existingModel ?? mongoose.model<Whisper>(modelName, whisperSchema);

const whisperModels = {
    schema: whisperSchema,
    model: WhisperModel,
    insert: zWhisper
};

export default whisperModels;
