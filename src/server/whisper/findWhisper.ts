// src/server/whisper/findWhisper.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { HttpError } from '../../errors';
import { WhisperDocument, WhisperModel } from '../../db/models/whisper';
import { success } from '../../utils/http';

const findWhisperInputSchema = z.object({
    gameId: z.string().min(1),
    whisperId: z.string().min(1),
    isActive: z.boolean().default(false)
});

export const findWhisper = createServerFn({
    method: 'POST'
})
    .inputValidator((data) => findWhisperInputSchema.parse(data))
    .handler(async ({ data }) => {
        const doc = (await WhisperModel.findOne({
            gameId: data.gameId,
            whisperId: data.whisperId,
            isActive: data.isActive
        }).lean()) as WhisperDocument;
        if (!doc) throw HttpError.NOT_FOUND(`game: ${data.gameId} and whisper: ${data.whisperId} not found.`);
        return success(doc);
    });
