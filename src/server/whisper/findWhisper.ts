// src/server/whisper/findWhisper.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { HttpError } from '../../errors';
import { WhisperDocument, WhisperModel } from '@/db/models/Whisper';
import { success } from '../../utils/http';
import type { Result } from '../../types/game';

const findWhisperInputSchema = z.object({
    gameId: z.string().min(1),
    whisperId: z.string().min(1),
    isActive: z.boolean().default(false)
});

export const findWhisper = createServerFn<'POST', Result<WhisperDocument>>({
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
