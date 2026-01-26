// src/routes/api/matches/$matchId/travel-approve.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zMatchIdParams, zTravelerDecisionInput } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { MatchModel } from '../../../../db/models/Game';
import { TravellerRequestModel } from '../../../../db/models/TravellerRequest';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { requireHost, requireStoryteller } from '../../../../server/authz/gameAuth';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';

export const Route = createFileRoute('/api/matches/$matchId/travel-approve')({
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
                if (match.status !== 'in_progress') {
                    return Response.json({ error: 'match_not_running' }, { status: 409 });
                }

                let hasPermission = false;
                try {
                    await requireStoryteller(match.roomId, user);
                    hasPermission = true;
                } catch {
                    try {
                        await requireHost(match.roomId, user);
                        hasPermission = true;
                    } catch {
                        // continue to reject
                    }
                }
                if (!hasPermission) {
                    return HttpError.FORBIDDEN('not_st_or_host');
                }

                if (!match.allowTravelers) {
                    return Response.json({ error: 'travelers_disabled' }, { status: 409 });
                }

                if (match.travelerCountUsed >= match.travelerLimit) {
                    return Response.json({ error: 'traveler_limit' }, { status: 409 });
                }

                const requestDoc = await TravellerRequestModel.findById(bodyResult.data.requestId).lean();
                if (!requestDoc || requestDoc.matchId !== match._id) {
                    return HttpError.NOT_FOUND('request');
                }
                if (requestDoc.status !== 'pending' || requestDoc.expiresAt <= new Date()) {
                    await TravellerRequestModel.updateOne({ _id: requestDoc._id }, { $set: { status: 'expired' } });
                    return Response.json({ error: 'request_invalid' }, { status: 409 });
                }

                if (match.travelerUserIds.includes(requestDoc.userId)) {
                    return Response.json({ error: 'already_traveler' }, { status: 409 });
                }

                await TravellerRequestModel.updateOne({ _id: requestDoc._id }, { $set: { status: 'approved' } });

                await MatchModel.updateOne(
                    { _id: match._id },
                    {
                        $addToSet: { travelerUserIds: requestDoc.userId },
                        $inc: { travelerCountUsed: 1 }
                    }
                );

                await GameMemberModel.updateOne(
                    { gameId: match.roomId, userId: requestDoc.userId },
                    { $set: { role: 'player', isSeated: true } },
                    { upsert: true }
                );

                const payload = {
                    kind: 'event',
                    type: 'travelerJoined',
                    ts: Date.now(),
                    payload: { matchId: match._id, roomId: match.roomId, userId: requestDoc.userId }
                };
                await broadcastRoomEvent(match.roomId, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
