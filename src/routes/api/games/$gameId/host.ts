// src/routes/api/games/$gameId/host.ts

import { createFileRoute } from '@tanstack/react-router';
import { zAssignHostInput } from '../../../../server/schemas/gameSchemas';
import { requireHost, requireMember } from '../../../../server/authz/gameAuth';
import { connectMongoose } from '../../../../db/connectMongoose';
import { zGameId } from '../../../../schemas';
import { setHostUserId } from '../../../../server/game';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
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

                const payload = {
                    kind: 'event',
                    type: 'hostChanged',
                    ts: Date.now(),
                    payload: { gameId, from: game.hostUserId, to: body.userId }
                };
                await broadcastRoomEvent(gameId, payload);
                return Response.json({ ok: true });
            }
        }
    }
});
