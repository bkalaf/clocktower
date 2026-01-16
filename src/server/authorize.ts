// src/server/authorize.ts
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import z from 'zod';
import { getUserFromReq } from './getUserFromReq';
import { HttpError } from '../errors';
import { GameRoles, UserId } from '../types/game';
import { requireGameMember } from './requireGameMember';
import { $keys } from '../$keys';
import { listWhisperTopicsForUser } from './listWhisperTopicsForUser';

const authorizeInputSchema = z.object({
    gameId: z.string().min(1)
});

export const authorize = createServerFn({
    method: 'POST'
})
    .inputValidator((data: z.infer<typeof authorizeInputSchema>) => authorizeInputSchema.parse(data))
    .handler(async ({ data: { gameId } }) => {
        const req = getRequest();
        const user = await getUserFromReq(req);
        if (!user) throw HttpError.BAD_REQUEST('No cookie with user');
        let member: { role: GameRoles; userId: UserId };
        try {
            member = await requireGameMember(gameId, user);
        } catch (error) {
            throw HttpError.FORBIDDEN('no user authorized');
        }
        const topics: string[] = [];
        topics.push($keys.publicTopic(gameId));
        if (member.role === 'storyteller') {
            topics.push($keys.stTopic(gameId));
        }
        const whispers =
            (await listWhisperTopicsForUser({ data: { gameId, userId: member.userId, role: member.role } })) ?? [];
        topics.push(...whispers);
        return Response.json({
            user,
            topics,
            member: { role: member.role }
        });
    });
