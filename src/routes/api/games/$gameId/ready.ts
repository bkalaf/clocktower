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
import { $keys } from '../../../../$keys';
import { getRedis } from '../../../../redis';

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
                const message = JSON.stringify(memberReadyPayload);
                const redis = await getRedis();
                await Promise.all([
                    redis.publish($keys.publicTopic(gameId), message),
                    redis.publish($keys.stTopic(gameId), message)
                ]);
                return Response.json({ ok: true });
            }
        }
    }
});
