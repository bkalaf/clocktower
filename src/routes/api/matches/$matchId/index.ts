// src/routes/api/matches/$matchId/index.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zMatchIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { connectMongoose } from '../../../../db/connectMongoose';
import { MatchModel } from '../../../../db/models/Match';
import { requireMember } from '../../../../server/authz/gameAuth';

export const Route = createFileRoute('/api/matches/$matchId/')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const parsed = parseParams(params, zMatchIdParams);
                if (!parsed.ok) return parsed.response;

                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                await connectMongoose();
                const match = await MatchModel.findById(parsed.data.matchId).lean();
                if (!match) return HttpError.NOT_FOUND('match');

                try {
                    await requireMember(match.roomId, user._id);
                } catch (error) {
                    return HttpError.FORBIDDEN('not_in_room');
                }

                return Response.json(match);
            }
        }
    }
});
