// src/routes/api/games/$gameId/ready.ts
import { createFileRoute } from '@tanstack/react-router';
import { HttpError } from '../../../../errors';
import { parseParams } from '../../../../server/parseParams';
import { zGameId } from '../../../../schemas';
import z from 'zod';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zReadyInput } from '../../../../server/schemas/gameSchemas';
import { connectMongoose } from '../../../../db/connectMongoose';
import { getUserFromReq } from '../../../../server/getUserFromReq';
import { requireMember } from '../../../../server/authz/gameAuth';
import { GameMemberModel } from '../../../../db/models/gameMember';

const zReadyParams = z.object({
    gameId: zGameId
});

export const Route = createFileRoute('/api/games/$gameId/ready')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const user = await getUserFromReq(request);
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const $params = parseParams(params, zReadyParams);
                const body = await parseJsonBody(request, zReadyInput);
                if (!$params.ok) {
                    return $params.response;
                }
                if (!body.ok) {
                    return body.response;
                }
                const {
                    data: { gameId }
                } = $params;

                await requireMember(gameId, user._id);
                await connectMongoose();

                await GameMemberModel.updateOne(
                    { gameId: gameId, userId: user._id },
                    {
                        $set: { isReady: body.data.isReady }
                    }
                );

                // TODO: publish realtime event: memberReadyChanged
                return Response.json({ ok: true });
            }
        }
    }
});
