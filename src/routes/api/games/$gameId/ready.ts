// src/routes/api/games/$gameId/ready.ts
import { createFileRoute } from '@tanstack/react-router';
import { HttpError } from '../../../../errors';
import { parseParams } from '../../../../server/parseParams';
import { zGameId } from '../../../../schemas';
import z from 'zod/v4';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zReadyInput } from '../../../../server/schemas/gameSchemas';
import { connectMongoose } from '../../../../db/connectMongoose';
import { requireMember } from '../../../../server/authz/gameAuth';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { createServerFn } from '@tanstack/react-start';
import { $z } from '../../../../server/schemas/z';

const zReadyParams = z.object({
    gameId: zGameId
});

export const makeReady = createServerFn<'POST', void>({
    method: 'POST'
})
    .inputValidator($z.makeReadyInput)
    .handler(async (data) => {
        await connectMongoose();
        const {
            data: { gameId, isReady }
        } = data;
        const user = await getUserFromCookie();
        requireMember(gameId, user._id);
    });
export const Route = createFileRoute('/api/games/$gameId/ready')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const $params = parseParams(params, zReadyParams);
                const body = await parseJsonBody(request, zReadyInput);

                await requireMember(gameId, user._id);
                await connectMongoose();

                await GameMemberModel.updateOne(
                    { gameId: gameId, userId: user._id },
                    {
                        $set: { isReady: body.data.isReady }
                    }
                );

                const memberReadyPayload = {
                    kind: 'event',
                    type: 'memberReadyChanged',
                    ts: Date.now(),
                    payload: {
                        gameId,
                        userId: user._id,
                        userName: user.name,
                        isReady: body.data.isReady
                    }
                };
                await broadcastRoomEvent(gameId, memberReadyPayload);
                return Response.json({ ok: true });
            }
        }
    }
});
