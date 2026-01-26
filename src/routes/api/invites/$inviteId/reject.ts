// src/routes/api/invites/$inviteId/reject.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zInviteIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { InviteModel } from '../../../../db/models/Invite';
import { connectMongoose } from '../../../../db/connectMongoose';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';

export const Route = createFileRoute('/api/invites/$inviteId/reject')({
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
                if (invite.invitedUserId !== user._id) return HttpError.FORBIDDEN('not_the_recipient');
                if (invite.status !== 'pending') {
                    return Response.json({ error: 'not_pending' }, { status: 409 });
                }

                await InviteModel.updateOne({ _id: invite._id }, { $set: { status: 'rejected' } });

                const payload = {
                    kind: 'event',
                    type: 'inviteRejected',
                    ts: Date.now(),
                    payload: { inviteId: invite._id, roomId: invite.roomId, userId: user._id }
                };
                await broadcastRoomEvent(invite.roomId, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
