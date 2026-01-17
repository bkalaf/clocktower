// src/serverFns/authorize.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { $is, GameRoles } from '../types/game';
import { requireGameMember } from './requireGameMember';
import { $keys } from '../$keys';
import { listWhisperTopicsForUser } from './listWhisperTopicsForUser';
import { getUserFromCookie } from './getUserFromCookie';
import $response from '../utils/http';
import { zRequireGameMemberOutput } from '../schemas';

const authorizeInputSchema = z.object({
    gameId: z.string().min(1)
});

export const authorize = createServerFn({
    method: 'POST'
})
    .inputValidator(authorizeInputSchema)
    .handler(async ({ data: { gameId } }) => {
        const user = await getUserFromCookie();
        if (user == null) return null;
        let member: { role: GameRoles; userId: string } | null;
        try {
            member = await requireGameMember({
                data: {
                    gameId,
                    user
                }
            });
            if (member == null) return null;
        } catch (error) {
            return null;
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
