// src/routes/api/rooms/$roomId/index.ts
import { createFileRoute } from '@tanstack/react-router';
import { parseParams } from '../../../../server/parseParams';
import { zRoomIdParams } from '../../../../server/schemas/roomSchemas';
import { getUserFromCookie } from '../../../../serverFns/getId/getUserFromCookie';
import { HttpError } from '../../../../errors';
import { requireGame } from '../../../../server/authz/gameAuth';
import { GameMemberModel } from '../../../../db/models/GameMember';
import { connectMongoose } from '../../../../db/connectMongoose';

export const Route = createFileRoute('/api/rooms/$roomId')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const user = await getUserFromCookie();
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('UNAUTHORIZED');

                const parsed = parseParams(params, zRoomIdParams);
                if (!parsed.ok) return parsed.response;
                const { roomId } = parsed.data;

                const room = await requireGame(roomId);
                await connectMongoose();
                const member = await GameMemberModel.findOne({ gameId: roomId, userId: user._id }).lean();
                if (!member) {
                    return HttpError.FORBIDDEN('not_member');
                }

                const storytellerCount = await GameMemberModel.countDocuments({
                    gameId: roomId,
                    role: 'storyteller'
                });

                return Response.json({
                    room,
                    memberRole: member.role,
                    storytellerCount
                });
            }
        }
    }
});
