// src/routes/api/invites/$inviteId/cancel.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zInviteIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { InviteModel } from '../../../../db/models/Invite';
import { requireHost } from '../../../../server/authz/gameAuth';
import { connectMongoose } from '../../../../db/connectMongoose';
import { broadcastRoomEvent } from '../../../../server/realtime/roomBroadcast';

export const Route = createFileRoute('/api/invites/$inviteId/cancel')({
    server: {
        handlers: {
            POST: async ({ params }) => {
                const parsedParams = parseParams(params, zInviteIdParams);
                if (!parsedParams.ok) {
                    return parsedParams.response;
                }

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const invite = await InviteModel.findById(parsedParams.data.inviteId).lean();
                if (!invite) return HttpError.NOT_FOUND('invite');
                if (invite.status !== 'pending') {
                    return Response.json({ error: 'invite_not_pending' }, { status: 409 });
                }

                await requireHost(invite.roomId, user);
                await InviteModel.updateOne({ _id: invite._id }, { $set: { status: 'canceled' } });

                const payload = {
                    kind: 'event',
                    type: 'inviteCanceled',
                    ts: Date.now(),
                    payload: { inviteId: invite._id, roomId: invite.roomId }
                };
                await broadcastRoomEvent(invite.roomId, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
