// src/routes/api/rooms/$roomId/match.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zRoomIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { MatchModel } from '../../../../db/models/Game';
import { requireGame, requireMember } from '../../../../server/authz/gameAuth';

export const Route = createFileRoute('/api/rooms/$roomId/match')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const parsed = parseParams(params, zRoomIdParams);
                if (!parsed.ok) return parsed.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const room = await requireGame(parsed.data.roomId);
                try {
                    await requireMember(room._id, user._id);
                } catch (error) {
                    return HttpError.FORBIDDEN('not_in_room');
                }

                const match = await MatchModel.findOne({ roomId: room._id, status: 'in_progress' })
                    .sort({ createdAt: -1 })
                    .lean();
                if (!match) return HttpError.NOT_FOUND('match');

                return Response.json(match);
            }
        }
    }
});
