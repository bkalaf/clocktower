// src/db/models/whisper.ts
import mongoose, { Schema } from 'mongoose';
import { Whisper } from '../../types/game';

const whisperSchema = new Schema<Whisper>(
    {
        _id: { type: String, required: true, minLength: 16 },
        gameId: { type: String, required: true, minLength: 16, index: true },
        topicId: { type: String, required: true, minLength: 16, index: true },
        creator: { type: String, required: true, minLength: 16 },
        members: [{ type: String, required: true, minLength: 16, index: true }],
        isActive: { type: Boolean, default: false, required: true, index: true },
        meta: {
            name: { type: String, minLength: 16 },
            includeStoryteller: { type: Boolean, default: false, required: true }
        }
    },
    { timestamps: true }
);

whisperSchema.index({ gameId: 1, isActive: 1 });

export const WhisperModel =
    (mongoose.models['Whisper'] as mongoose.Model<Whisper>) ?? mongoose.model('Whisper', whisperSchema);
export type WhisperType = mongoose.InferRawDocType<Whisper>;
export type WhisperDocument = mongoose.HydratedDocument<WhisperType>;
