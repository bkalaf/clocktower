// src/routes/api/games/$gameId/whispers.ts
import { createWhisper } from '../../../../server/whisper/createWhisper';
import { zCreateWhisperInput, zCreateWhisperParams } from '../../../../schemas';
import { HttpError } from '../../../../errors';
import { GameMemberModel } from '../../../../db/models/gameMember';
import { getUserFromReq } from '../../../../server/getUserFromReq';
import { requireRole } from '../../../../server/requireRole';
import { parseParams } from '../../../../server/parseParams';
import { parseJsonBody } from '../../../../server/parseJsonBody';
import { created } from '../../../../utils/http';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/games/$gameId/whispers')({
    server: {
        handlers: {
            POST: async ({ params, request }) => {
                const p = parseParams(params, zCreateWhisperParams);
                if (!p.ok) {
                    return p.response;
                }
                const b = await parseJsonBody(request, zCreateWhisperInput);
                if (!b.ok) {
                    return b.response;
                }
                const { gameId } = p.data;
                const body = b.data;

                const user = await getUserFromReq(request);
                if (!user) return HttpError.UNAUTHORIZED_RESPONSE('Unauthorized');

                const { userId } = await requireRole(gameId, user, ['player', 'storyteller']);
                const participantUserIds = body.participantUserIds;
                const uniqueParticipantUserIds = Array.from(new Set(participantUserIds));
                const memberCount = await GameMemberModel.countDocuments({
                    gameId,
                    userId: { $in: uniqueParticipantUserIds }
                });
                if (memberCount !== uniqueParticipantUserIds.length) {
                    return HttpError.BAD_REQUEST_RESPONSE('Some participants are not members of this game.');
                }
                const whisper = await createWhisper({
                    gameId,
                    creator: userId,
                    members: uniqueParticipantUserIds,
                    name: body.name,
                    includeStoryteller: body.includeStoryTeller
                });
                return created(whisper);
            }
        }
    }
});
