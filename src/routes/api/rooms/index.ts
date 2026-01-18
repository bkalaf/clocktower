// src/routes/api/rooms/index.ts
import { createFileRoute } from '@tanstack/react-router';
import { randomUUID } from 'crypto';
import { parseJsonBody } from '../../../server/parseJsonBody';
import { zCreateRoomInput } from '../../../server/schemas/roomSchemas';
import { HttpError } from '../../../errors';
import { GameModel } from '../../../db/models/Game';
import { getUserFromCookie } from '../../../serverFns/getId/getUserFromCookie';
import { connectMongoose } from '../../../db/connectMongoose';
import { getScript } from '../../../server/scripts';

export const Route = createFileRoute('/api/rooms')({
    server: {
        handlers: {
            POST: async ({ request }) => {
                const parsed = await parseJsonBody(request, zCreateRoomInput);
                if (!parsed.ok) {
                    return parsed.response;
                }
                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const script = await getScript(parsed.data.scriptId);
                if (!script) {
                    return HttpError.BAD_REQUEST_RESPONSE('script_not_found');
                }

                await connectMongoose();
                const room = await GameModel.create({
                    _id: randomUUID(),
                    version: 1,
                    snapshot: {},
                    hostUserId: user._id,
                    scriptId: parsed.data.scriptId,
                    allowTravelers: parsed.data.allowTravelers,
                    visibility: parsed.data.visibility,
                    status: 'open',
                    endedAt: null,
                    lobbySettings: parsed.data.lobbySettings ?? null
                });
                return Response.json(room);
            }
        }
    }
});
