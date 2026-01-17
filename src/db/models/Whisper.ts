// src/db/models/Whisper.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas';
const { refs, aliases } = schemas;

const zWhisper = z.object({
    _id: aliases.whisperId,
    gameId: refs.game,
    topicId: refs.topic,
    creatorId: refs.user,
    members: z.array(refs.user),
    isActive: z.boolean().default(true),
    meta: z.object({
        name: aliases.name.meta({ description: 'The displayed name of the channel.' }),
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
