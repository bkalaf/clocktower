// src/routes/api/rooms/$roomId/script.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { zRoomIdParams, zChangeScriptInput } from '../../../../server/schemas/roomSchemas';
import { GameModel } from '../../../../db/models/_Game';
import { getScript } from '../../../../server/scripts';
import { connectMongoose } from '../../../../db/connectMongoose';
import { requireHost, requireStoryteller, storytellerCount } from '../../../../server/authz/gameAuth';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';

export const Route = createFileRoute('/api/rooms/$roomId/script')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const parsedParams = parseParams(params, zRoomIdParams);
                if (!parsedParams.ok) return parsedParams.response;

                const body = await parseJsonBody(request, zChangeScriptInput);
                if (!body.ok) return body.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const { roomId } = parsedParams.data;
                const room = await GameModel.findById(roomId).lean();
                if (!room) return HttpError.NOT_FOUND(`room:${roomId}`);
                if (room.status === 'in_match') {
                    return Response.json({ error: 'cannot_change_script_in_match' }, { status: 409 });
                }

                const script = await getScript(body.data.scriptId);
                if (!script) {
                    return HttpError.BAD_REQUEST_RESPONSE('script_not_found');
                }

                await connectMongoose();
                const stCount = await storytellerCount(roomId);
                if (stCount === 0) {
                    await requireHost(roomId, user);
                } else {
                    await requireStoryteller(roomId, user);
                }

                const nextStatus = room.status === 'closed' ? 'open' : room.status;
                await GameModel.updateOne({ _id: roomId }, { $set: { scriptId: script.scriptId, status: nextStatus } });

                const payload = {
                    kind: 'event',
                    type: 'roomScriptChanged',
                    ts: Date.now(),
                    payload: { roomId, scriptId: script.scriptId }
                };
                await broadcastRoomEvent(roomId, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
