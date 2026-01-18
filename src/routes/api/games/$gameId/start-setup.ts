// src/routes/api/games/$gameId/start-setup.ts
import { createFileRoute } from '@tanstack/react-router';
import { requireStoryteller, requireGame } from '../../../../server/authz/gameAuth';
import { HttpError } from '../../../../errors';
import { parseParams } from '../../../../server/parseParams';
import { zGameIdParams } from '../../../../server/schemas/gameSchemas';
import { getConnectedUserIds } from '../../../../server/realtime/presence';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { connectMongoose } from '../../../../db/connectMongoose';
import { setStatus } from '../../../../server/game';
import { broadcastRoomEvent } from '../../../../server/realtime/roomBroadcast';

export const Route = createFileRoute('/api/games/$gameId/start-setup')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const $params = parseParams(params, zGameIdParams);
                if (!$params.ok) {
                    return $params.response;
                }
                const { gameId } = $params.data;
                const game = await requireGame(gameId);
                await requireStoryteller(gameId, user);

                if (game.status !== 'open') {
                    return Response.json({ error: 'not_idle' }, { status: 409 });
                }

                const connected = await getConnectedUserIds(gameId);
                const minPlayers = game.lobbySettings?.minPlayers ?? 0;
                const planned =
                    game.lobbySettings?.plannedStartTime ?
                        new Date(game.lobbySettings.plannedStartTime).getTime()
                    :   null;
                const now = Date.now();

                const meetsMin = connected.length >= minPlayers && minPlayers > 0;
                const meetsTime = planned != null && now >= planned;

                if (!meetsMin && !meetsTime) {
                    return Response.json({ error: 'not_ready_to_start_setup' }, { status: 409 });
                }

                await connectMongoose();
                await setStatus(gameId, 'open');

                const payload = {
                    kind: 'event',
                    type: 'system/setupStarted',
                    ts: Date.now(),
                    payload: { gameId }
                };
                await broadcastRoomEvent(gameId, payload);
                return Response.json({ ok: true });
            }
        }
    }
});
