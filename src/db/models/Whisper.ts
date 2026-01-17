// src/db/models/Whisper.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';

const zWhisper = z.object({
    _id: z.uuid('Must be a UUID'),
    gameId: z.uuid('Must be a UUID'),
    topicId: z.uuid('Must be a UUID'),
    creatorId: z.uuid('Must be a UUID'),
    members: z.array(z.uuid('Must be a UUID')),
    isActive: z.boolean().default(true),
    meta: z.object({
        name: z
            .string()
            .min(3, 'Must be over 3 characters long')
            .max(64, 'Must be under 64 characters')
            .meta({ description: 'The displayed name of the channel.' }),
        includeStoryteller: z.boolean().default(true)
    })
});

const whisperModels = getTypesFor('Whisper', zWhisper, { collection: 'whisper', timestamps: true }, {}, [
    { gameId: 1, isActive: 1 }
]);

export type Whisper = z.infer<typeof zWhisper>;
export type WhisperType = mongoose.InferRawDocType<Whisper>;
export type WhisperDocument = mongoose.HydratedDocument<WhisperType>;
export const WhisperModel = whisperModels.model;
export default whisperModels;
