// src/routes/api/games/$gameId/storytellers.ts
import { createFileRoute } from '@tanstack/react-router';
import { HttpError } from '../../../../errors';
import { parseParams } from '../../../../server/parseParams';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { requireHost, requireMember } from '../../../../server/authz/gameAuth';
import { zGameIdParams, zPromoteStorytellerInput } from '../../../../server/schemas/gameSchemas';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { connectMongoose } from '../../../../db/connectMongoose';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';

export const Route = createFileRoute('/api/games/$gameId/storytellers')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const user = await getUserFromCookie();
                if (!user) {
                    return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');
                }

                const $params = parseParams(params, zGameIdParams);
                if (!$params.ok) {
                    return $params.response;
                }
                const {
                    data: { gameId }
                } = $params;
                const body = await parseJsonBody(request, zPromoteStorytellerInput);
                if (!body.ok) {
                    return body.response;
                }
                const { userId } = body.data;

                await requireHost(gameId, user);
                await requireMember(gameId, userId);
                await connectMongoose();

                // add-only: set union
                await GameMemberModel.updateOne({ gameId, userId: userId }, { $set: { role: 'storyteller' } });

                const payload = {
                    kind: 'event',
                    type: 'storytellerPromoted',
                    ts: Date.now(),
                    payload: { gameId, userId }
                };
                await broadcastRoomEvent(gameId, payload);
                return Response.json({ ok: true });
            }
        }
    }
});
