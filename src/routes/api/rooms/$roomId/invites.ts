// src/routes/api/rooms/$roomId/invites.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zRoomIdParams, zCreateInvitesInput } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { InviteModel } from '../../../../db/models/Invite';
import { requireHost } from '../../../../server/authz/gameAuth';
import { availableSeats, loadRoom } from '../../../../server/rooms/helpers';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
import { randomUUID } from 'crypto';

export const Route = createFileRoute('/api/rooms/$roomId/invites')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const paramResult = parseParams(params, zRoomIdParams);
                if (!paramResult.ok) return paramResult.response;

                const bodyResult = await parseJsonBody(request, zCreateInvitesInput);
                if (!bodyResult.ok) return bodyResult.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const { roomId } = paramResult.data;
                const room = await loadRoom(roomId);
                if (!room) return HttpError.NOT_FOUND(`room:${roomId}`);

                await requireHost(roomId, user);
                const maxPlayers = room.lobbySettings?.maxPlayers ?? 15;
                const uniqueIds = Array.from(new Set(bodyResult.data.invitedUserIds));

                if (bodyResult.data.kind === 'seat') {
                    const seatsLeft = await availableSeats(roomId, maxPlayers);
                    if (uniqueIds.length > seatsLeft) {
                        return Response.json({ error: 'not_enough_seats' }, { status: 409 });
                    }
                }

                const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
                const invites = await InviteModel.insertMany(
                    uniqueIds.map((userId) => ({
                        _id: randomUUID(),
                        roomId,
                        invitedUserId: userId,
                        kind: bodyResult.data.kind,
                        status: 'pending',
                        createdByUserId: user._id,
                        expiresAt,
                        message: bodyResult.data.message
                    }))
                );

                const payload = {
                    kind: 'event',
                    type: 'inviteCreated',
                    ts: Date.now(),
                    payload: { roomId, count: invites.length }
                };
                await broadcastRoomEvent(roomId, payload);

                return Response.json({ invites });
            }
        }
    }
});
