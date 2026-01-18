// src/routes/api/matches/$matchId/phase.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { zMatchIdParams, zMatchPhaseInput } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { MatchModel } from '../../../../db/models/Match';
import { requireStoryteller } from '../../../../server/authz/gameAuth';
import { broadcastRoomEvent } from '../../../../server/realtime/roomBroadcast';

export const Route = createFileRoute('/api/matches/$matchId/phase')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const paramResult = parseParams(params, zMatchIdParams);
                if (!paramResult.ok) return paramResult.response;

                const bodyResult = await parseJsonBody(request, zMatchPhaseInput);
                if (!bodyResult.ok) return bodyResult.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const match = await MatchModel.findById(paramResult.data.matchId).lean();
                if (!match) return HttpError.NOT_FOUND('match');
                if (match.status !== 'in_progress') {
                    return Response.json({ error: 'match_not_running' }, { status: 409 });
                }

                await requireStoryteller(match.roomId, user);

                const updates: Record<string, unknown> = {
                    phase: bodyResult.data.phase,
                    subphase: bodyResult.data.subphase
                };
                if (typeof bodyResult.data.dayNumber === 'number') {
                    updates.dayNumber = bodyResult.data.dayNumber;
                }
                if (typeof bodyResult.data.nominationsOpen === 'boolean') {
                    updates.nominationsOpen = bodyResult.data.nominationsOpen;
                }
                if (typeof bodyResult.data.breakoutWhispersEnabled === 'boolean') {
                    updates.breakoutWhispersEnabled = bodyResult.data.breakoutWhispersEnabled;
                }

                await MatchModel.updateOne({ _id: match._id }, { $set: updates });

                const payload = {
                    kind: 'event',
                    type: 'matchPhaseChanged',
                    ts: Date.now(),
                    payload: { matchId: match._id, ...bodyResult.data }
                };
                await broadcastRoomEvent(match.roomId, payload);
                if (bodyResult.data.phase === 'night') {
                    await broadcastRoomEvent(match.roomId, {
                        kind: 'event',
                        type: 'closeBreakoutWhispers',
                        ts: Date.now(),
                        payload: { matchId: match._id }
                    });
                }

                return Response.json({ ok: true });
            }
        }
    }
});
