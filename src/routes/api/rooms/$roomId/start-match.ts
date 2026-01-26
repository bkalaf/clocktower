// src/routes/api/rooms/$roomId/start-match.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zRoomIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { GameModel } from '../../../../db/models/_Game';
import { MatchModel } from '../../../../db/models/Game';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { requireHost } from '../../../../server/authz/gameAuth';
import { randomUUID } from 'crypto';
import { broadcastRoomEvent } from '../../../../server/_authed.rooms.index.tsx/roomBroadcast';
import { getConnectedUserIds } from '../../../../server/_authed.rooms.index.tsx/presence';
import { getRoomDoc } from '../../../../server/persistence/roomPersistence';
import { startGameMachine } from '../../../../server/gameService';
import { GameRoles, StorytellerMode } from '../../../../types/game';

export const Route = createFileRoute('/api/rooms/$roomId/start-match')({
    server: {
        handlers: {
            POST: async ({ params }) => {
                const paramResult = parseParams(params, zRoomIdParams);
                if (!paramResult.ok) return paramResult.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const room = await GameModel.findById(paramResult.data.roomId).lean();
                if (!room) return HttpError.NOT_FOUND('room');
                if (room.status === 'in_match') {
                    return Response.json({ error: 'already_in_match' }, { status: 409 });
                }

                await requireHost(room._id, user);

                if (!room.scriptId) {
                    return Response.json({ error: 'missing_script' }, { status: 409 });
                }

                const connectedIds = await getConnectedUserIds(room._id);
                const members = await GameMemberModel.find({ gameId: room._id, userId: { $in: connectedIds } }).lean();
                const connectedUserIds = connectedIds.reduce<Record<string, GameRoles>>((acc, userId) => {
                    const member = members.find((entry) => entry.userId === userId);
                    acc[userId] = (member?.role ?? 'spectator') as GameRoles;
                    return acc;
                }, {});
                const snapshot = await getRoomDoc(room._id);
                const storytellerMode = (snapshot?.storytellerMode ?? 'ai') as StorytellerMode;

                const travelerLimit = room.lobbySettings?.maxTravelers ?? 5;
                const newMatch = await MatchModel.create({
                    _id: randomUUID(),
                    roomId: room._id,
                    status: 'in_progress',
                    phase: 'day',
                    subphase: 'day.dawn_announcements',
                    dayNumber: 1,
                    allowTravelers: room.allowTravelers,
                    travelerUserIds: [],
                    travelerCountUsed: 0,
                    travelerLimit,
                    nominationsOpen: false,
                    breakoutWhispersEnabled: true
                });

                await GameModel.updateOne({ _id: room._id }, { $set: { status: 'in_match' } });

                await startGameMachine({
                    roomId: room._id,
                    matchId: newMatch._id,
                    maxPlayers: room.maxPlayers,
                    connectedUserIds,
                    storytellerMode,
                    scriptId: room.scriptId
                });

                const payload = {
                    kind: 'event',
                    type: 'matchStarted',
                    ts: Date.now(),
                    payload: { roomId: room._id, matchId: newMatch._id }
                };
                await broadcastRoomEvent(room._id, payload);

                return Response.json(newMatch);
            }
        }
    }
});
