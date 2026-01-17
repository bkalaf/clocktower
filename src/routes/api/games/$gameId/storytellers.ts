// src/routes/api/games/$gameId/storytellers.ts
import { createFileRoute } from '@tanstack/react-router';
import { HttpError } from '../../../../errors';
import { parseParams } from '../../../../server/parseParams';
import { GameMemberModel } from '../../../../db/models/gameMember';
import { requireHost, requireMember } from '../../../../server/authz/gameAuth';
import { zGameIdParams, zPromoteStorytellerInput } from '../../../../server/schemas/gameSchemas';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { connectMongoose } from '../../../../db/connectMongoose';
import { getRedis } from '../../../../redis';
import { $keys } from '../../../../$keys';

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

                const redis = await getRedis();
                const payload = {
                    kind: 'event',
                    type: 'storytellerPromoted',
                    ts: Date.now(),
                    payload: { gameId, userId }
                };
                const message = JSON.stringify(payload);
                await Promise.all([
                    redis.publish($keys.publicTopic(gameId), message),
                    redis.publish($keys.stTopic(gameId), message)
                ]);
                return Response.json({ ok: true });
            }
        }
    }
});
