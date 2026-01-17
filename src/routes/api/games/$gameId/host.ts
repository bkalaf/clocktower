// src/routes/api/games/$gameId/host.ts

import { createFileRoute } from '@tanstack/react-router';
import { zAssignHostInput } from '../../../../server/schemas/gameSchemas';
import { requireHost, requireMember } from '../../../../server/authz/gameAuth';
import { connectMongoose } from '../../../../db/connectMongoose';
import { getUserFromReq } from '../../../../server/getUserFromReq';
import { zGameId } from '../../../../schemas';
import { setHostUserId } from '../../../../server/game';

export const Route = createFileRoute('/api/games/$gameId/host')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const user = await getUserFromReq(request);
                if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 });

                const gameId = zGameId.parse(params.gameId);
                const body = zAssignHostInput.parse(await request.json());

                await requireHost(gameId, user);
                await requireMember(gameId, body.userId);
                await connectMongoose();

                await setHostUserId(gameId, body.userId);

                // TODO: publish realtime event: hostChanged
                return Response.json({ ok: true });
            }
        }
    }
});
