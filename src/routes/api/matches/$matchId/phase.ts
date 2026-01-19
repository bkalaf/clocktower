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
import {
    broadcastRoomEvent,
    broadcastNominationClosed,
    broadcastNominationHistory,
    broadcastNominationOpened,
    broadcastNominationResolved,
    type NominationEventPayload,
    type NominationResolvedPayload,
    type VoteHistoryRecord
} from '../../../../server/realtime/roomBroadcast';

export const Route = createFileRoute('/api/matches/$matchId/phase')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const paramResult = parseParams(params, zMatchIdParams);
                if (!paramResult.ok) return paramResult.response;

                const bodyResult = await parseJsonBody(request, zMatchPhaseInput);
                if (!bodyResult.ok) return bodyResult.response;
                const body = bodyResult.data;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const match = await MatchModel.findById(paramResult.data.matchId).lean();
                if (!match) return HttpError.NOT_FOUND('match');
                if (match.status !== 'in_progress') {
                    return Response.json({ error: 'match_not_running' }, { status: 409 });
                }

                const prevNominationsOpen = Boolean(match.nominationsOpen);
                const nextNominationsOpen = body.nominationsOpen ?? prevNominationsOpen;
                const matchId = match._id;
                const roomId = match.roomId;
                const nominationPayload: NominationEventPayload | null =
                    body.nomination ?
                        {
                            matchId,
                            nominationType: body.nomination.nominationType,
                            nominatorId: body.nomination.nominatorId,
                            nomineeId: body.nomination.nomineeId
                        }
                    :   null;
                const prevVoteHistory = match.voteHistory ?? [];
                const bodyVoteHistory = body.voteHistory;
                const newHistoryEntries = (
                    bodyVoteHistory && bodyVoteHistory.length > prevVoteHistory.length ?
                        bodyVoteHistory.slice(prevVoteHistory.length)
                    :   []) as VoteHistoryRecord[];
                const nextOnTheBlock = body.onTheBlock === undefined ? match.onTheBlock : body.onTheBlock;
                const onTheBlockNomineeId = nextOnTheBlock?.nomineeId;

                await requireStoryteller(match.roomId, user);

                const updates: Record<string, unknown> = {
                    phase: body.phase,
                    subphase: body.subphase
                };
                if (typeof body.dayNumber === 'number') {
                    updates.dayNumber = body.dayNumber;
                }
                if (typeof body.nominationsOpen === 'boolean') {
                    updates.nominationsOpen = body.nominationsOpen;
                }
                if (typeof body.breakoutWhispersEnabled === 'boolean') {
                    updates.breakoutWhispersEnabled = body.breakoutWhispersEnabled;
                }
                if (body.playerSeatMap !== undefined) {
                    updates.playerSeatMap = body.playerSeatMap;
                }
                if (body.aliveById !== undefined) {
                    updates.aliveById = body.aliveById;
                }
                if (body.isTravelerById !== undefined) {
                    updates.isTravelerById = body.isTravelerById;
                }
                if (body.ghostVoteAvailableById !== undefined) {
                    updates.ghostVoteAvailableById = body.ghostVoteAvailableById;
                }
                if (body.voteHistory !== undefined) {
                    updates.voteHistory = body.voteHistory;
                }
                if (body.onTheBlock !== undefined) {
                    updates.onTheBlock = body.onTheBlock;
                }

                await MatchModel.updateOne({ _id: match._id }, { $set: updates });

                if (!prevNominationsOpen && nextNominationsOpen && nominationPayload) {
                    await broadcastNominationOpened(roomId, nominationPayload);
                }
                if (prevNominationsOpen && !nextNominationsOpen && nominationPayload) {
                    await broadcastNominationClosed(roomId, nominationPayload);
                }
                for (const entry of newHistoryEntries) {
                    const resolvedPayload: NominationResolvedPayload = {
                        matchId,
                        nominationType: entry.nominationType,
                        nominatorId: entry.nominatorId,
                        nomineeId: entry.nomineeId,
                        votesFor: entry.votesFor,
                        threshold: entry.threshold,
                        passed: entry.passed,
                        onTheBlockNomineeId
                    };
                    await broadcastNominationResolved(roomId, resolvedPayload);
                    await broadcastNominationHistory(roomId, matchId, entry);
                }

                const payload = {
                    kind: 'event',
                    type: 'matchPhaseChanged',
                    ts: Date.now(),
                    payload: { matchId: match._id, ...body }
                };
                await broadcastRoomEvent(match.roomId, payload);
                if (body.phase === 'night') {
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
