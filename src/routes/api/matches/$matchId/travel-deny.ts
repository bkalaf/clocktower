// src/routes/api/matches/$matchId/travel-deny.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zMatchIdParams, zTravelerDecisionInput } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { MatchModel } from '../../../../db/models/Game';
import { TravellerRequestModel } from '../../../../db/models/TravellerRequest';
import { requireHost, requireStoryteller } from '../../../../server/authz/gameAuth';
import { broadcastRoomEvent } from '../../../../server/realtime/roomBroadcast';

export const Route = createFileRoute('/api/matches/$matchId/travel-deny')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const paramResult = parseParams(params, zMatchIdParams);
                if (!paramResult.ok) return paramResult.response;

                const bodyResult = await parseJsonBody(request, zTravelerDecisionInput);
                if (!bodyResult.ok) return bodyResult.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const match = await MatchModel.findById(paramResult.data.matchId).lean();
                if (!match) return HttpError.NOT_FOUND('match');

                let hasPermission = false;
                try {
                    await requireStoryteller(match.roomId, user);
                    hasPermission = true;
                } catch {
                    try {
                        await requireHost(match.roomId, user);
                        hasPermission = true;
                    } catch {
                        //
                    }
                }
                if (!hasPermission) {
                    return HttpError.FORBIDDEN('not_st_or_host');
                }

                const requestDoc = await TravellerRequestModel.findById(bodyResult.data.requestId).lean();
                if (!requestDoc || requestDoc.matchId !== match._id) {
                    return HttpError.NOT_FOUND('request');
                }
                if (requestDoc.status !== 'pending') {
                    return Response.json({ error: 'request_invalid' }, { status: 409 });
                }

                await TravellerRequestModel.updateOne({ _id: requestDoc._id }, { $set: { status: 'rejected' } });

                const payload = {
                    kind: 'event',
                    type: 'travelerDenied',
                    ts: Date.now(),
                    payload: { matchId: match._id, roomId: match.roomId, userId: requestDoc.userId }
                };
                await broadcastRoomEvent(match.roomId, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
