// src/routes/api/games/$gameId/host.ts

import { createFileRoute } from '@tanstack/react-router';
import { zAssignHostInput } from '../../../../server/schemas/gameSchemas';
import { requireHost, requireMember } from '../../../../server/authz/gameAuth';
import { connectMongoose } from '../../../../db/connectMongoose';
import { getRedis } from '../../../../redis';
import { zGameId } from '../../../../schemas';
import { $keys } from '../../../../$keys';
import { setHostUserId } from '../../../../server/game';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { $is } from '../../../../types/game';
import { createServerFn } from '@tanstack/react-start';

export const hostPost = createServerFn({
    method: 'POST'
})
    .inputValidator(zAssignHostInput)
    .handler(async (data) => {});
export const Route = createFileRoute('/api/games/$gameId/host')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const response = await getUserFromCookie();
                if (!$is.failure(response)) return response;
                const user = zAuthUser;
                const gameId = zGameId.parse(params.gameId);
                const body = zAssignHostInput.parse(await request.json());

                const game = await requireHost(gameId, user);
                await requireMember(gameId, body.userId);
                await connectMongoose();

                await setHostUserId(gameId, body.userId);

                const redis = await getRedis();
                const payload = {
                    kind: 'event',
                    type: 'hostChanged',
                    ts: Date.now(),
                    payload: { gameId, from: game.hostUserId, to: body.userId }
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
