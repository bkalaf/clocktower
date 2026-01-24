// src/routes/api/invites/$inviteId/accept.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zInviteIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { InviteModel } from '../../../../db/models/Invite';
import { GameModel } from '../../../../db/models/_Game';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { connectMongoose } from '../../../../db/connectMongoose';
import { availableSeats } from '../../../../server/rooms/helpers';
import { broadcastRoomEvent } from '../../../../server/realtime/roomBroadcast';

export const Route = createFileRoute('/api/invites/$inviteId/accept')({
    server: {
        handlers: {
            POST: async ({ params }) => {
                const parsedParams = parseParams(params, zInviteIdParams);
                if (!parsedParams.ok) return parsedParams.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const invite = await InviteModel.findById(parsedParams.data.inviteId).lean();
                if (!invite) return HttpError.NOT_FOUND('invite');
                if (invite.invitedUserId !== user._id) {
                    return HttpError.FORBIDDEN('wrong_invitee');
                }

                const now = new Date();
                if (invite.expiresAt.getTime() <= now.getTime()) {
                    await InviteModel.updateOne({ _id: invite._id }, { $set: { status: 'expired' } });
                    return Response.json({ error: 'expired' }, { status: 410 });
                }

                if (user.penaltyUntil && user.penaltyUntil > now) {
                    return Response.json({ error: 'penalized' }, { status: 403 });
                }

                const activeMemberships = await GameMemberModel.find({ userId: user._id, role: 'player' }).lean();
                const activeRoomIds = activeMemberships.map((m) => m.gameId);
                const activeMatch = await GameModel.findOne({
                    _id: { $in: activeRoomIds },
                    status: 'in_match'
                }).lean();
                if (activeMatch) {
                    return Response.json({ error: 'already_in_match' }, { status: 409 });
                }

                const room = await GameModel.findById(invite.roomId).lean();
                if (!room) return HttpError.NOT_FOUND('room');
                if (room.status === 'in_match') {
                    return Response.json({ error: 'room_in_match' }, { status: 409 });
                }

                if (invite.kind === 'seat') {
                    const maxPlayers = room.lobbySettings?.maxPlayers ?? 15;
                    const seatsLeft = await availableSeats(room._id, maxPlayers);
                    if (seatsLeft <= 0) {
                        await InviteModel.updateOne({ _id: invite._id }, { $set: { status: 'rejected' } });
                        return Response.json({ error: 'no_seats' }, { status: 409 });
                    }
                }

                await GameMemberModel.updateOne(
                    { gameId: room._id, userId: user._id },
                    {
                        $set: {
                            role: invite.kind === 'seat' ? 'player' : 'spectator',
                            isSeated: invite.kind === 'seat'
                        }
                    },
                    { upsert: true }
                );

                await InviteModel.updateOne({ _id: invite._id }, { $set: { status: 'accepted' } });

                const payload = {
                    kind: 'event',
                    type: 'inviteAccepted',
                    ts: Date.now(),
                    payload: { inviteId: invite._id, roomId: room._id, userId: user._id }
                };
                await broadcastRoomEvent(room._id, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
