// src/server/gameMember/findGameMember.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { GameMemberDocument, GameMemberModel } from '../../db/models/GameMember';
import { HttpError } from '../../errors';
import { success } from '../../utils/http';

const findGameMemberInputSchema = z.object({
    gameId: z.string().min(1),
    userId: z.string().min(1)
});

export const findGameMember = createServerFn({
    method: 'POST'
})
    .inputValidator((data) => findGameMemberInputSchema.parse(data))
    .handler(async ({ data }) => {
        const doc = (await GameMemberModel.findOne({
            gameId: data.gameId,
            userId: data.userId
        }).lean()) as GameMemberDocument;
        if (!doc) throw HttpError.NOT_FOUND(`game: ${data.gameId} and user: ${data.userId} not found.`);
        return success(doc);
    });
