// src/routes/api/rooms/$roomId/empty-seat.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zRoomIdParams, zModerationActionInput } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { requireHost } from '../../../../server/authz/gameAuth';
import { connectMongoose } from '../../../../db/connectMongoose';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { ModerationLogModel } from '../../../../db/models/ModerationLog';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
import { randomUUID } from 'crypto';

export const Route = createFileRoute('/api/rooms/$roomId/empty-seat')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const parsedParams = parseParams(params, zRoomIdParams);
                if (!parsedParams.ok) return parsedParams.response;

                const parsedBody = await parseJsonBody(request, zModerationActionInput);
                if (!parsedBody.ok) return parsedBody.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const room = await requireHost(parsedParams.data.roomId, user);
                if (room.status === 'in_match') {
                    return Response.json({ error: 'cannot_moderate_in_match' }, { status: 409 });
                }

                await connectMongoose();
                await GameMemberModel.updateOne(
                    { gameId: room._id, userId: parsedBody.data.userId },
                    { $set: { role: 'spectator', isSeated: false } }
                );

                await ModerationLogModel.create({
                    _id: randomUUID(),
                    roomId: room._id,
                    actorUserId: user._id,
                    targetUserId: parsedBody.data.userId,
                    action: 'emptySeat',
                    reasonCode: parsedBody.data.reasonCode,
                    message: parsedBody.data.message,
                    ts: new Date()
                });

                const payload = {
                    kind: 'event',
                    type: 'seatEmptied',
                    ts: Date.now(),
                    payload: { roomId: room._id, userId: parsedBody.data.userId, action: 'emptySeat' }
                };
                await broadcastRoomEvent(room._id, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
