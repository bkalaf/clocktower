// src/routes/api/matches/$matchId/travel-request.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zMatchIdParams, zTravelRequestInput } from '../../../../server/schemas/roomSchemas';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { MatchModel } from '../../../../db/models/Game';
import { TravellerRequestModel } from '../../../../db/models/TravellerRequest';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
import { randomUUID } from 'crypto';

export const Route = createFileRoute('/api/matches/$matchId/travel-request')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const paramResult = parseParams(params, zMatchIdParams);
                if (!paramResult.ok) return paramResult.response;

                const bodyResult = await parseJsonBody(request, zTravelRequestInput);
                if (!bodyResult.ok) return bodyResult.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const match = await MatchModel.findById(paramResult.data.matchId).lean();
                if (!match) return HttpError.NOT_FOUND('match');
                if (match.status !== 'in_progress') {
                    return Response.json({ error: 'match_not_running' }, { status: 409 });
                }
                if (!match.allowTravelers || match.travelerCountUsed >= match.travelerLimit) {
                    return Response.json({ error: 'travelers_disabled' }, { status: 409 });
                }

                const member = await GameMemberModel.findOne({ gameId: match.roomId, userId: user._id });
                if (!member || member.role === 'spectator') {
                    return HttpError.FORBIDDEN('spectators_cannot_travel');
                }

                if (user.penaltyUntil && user.penaltyUntil > new Date()) {
                    return Response.json({ error: 'penalized' }, { status: 403 });
                }

                const already = await TravellerRequestModel.findOne({
                    matchId: match._id,
                    userId: user._id,
                    status: 'pending',
                    expiresAt: { $gt: new Date() }
                });
                if (already) {
                    return Response.json({ error: 'request_pending' }, { status: 409 });
                }

                const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
                await TravellerRequestModel.create({
                    _id: randomUUID(),
                    matchId: match._id,
                    roomId: match.roomId,
                    userId: user._id,
                    status: 'pending',
                    expiresAt,
                    message: bodyResult.data.message
                });

                const payload = {
                    kind: 'event',
                    type: 'travelRequestCreated',
                    ts: Date.now(),
                    payload: { matchId: match._id, roomId: match.roomId, userId: user._id }
                };
                await broadcastRoomEvent(match.roomId, payload);

                return Response.json({ ok: true });
            }
        }
    }
});
