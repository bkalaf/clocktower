// src/serverFns/authorize.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { GameRoles } from '../types/game';
import { $keys } from '../keys';
import { listWhisperTopicsForUser } from './listWhisperTopicsForUser';
import { getUserFromCookie } from './getId/getUserFromCookie';
import inputs from '../schemas/inputs';
import require from './require';

export const authorize = createServerFn({
    method: 'POST'
})
    .inputValidator(inputs._id)
    .handler(async ({ data: gameId }) => {
        const user = await getUserFromCookie();
        let member: { role: GameRoles; userId: string };
        try {
            member = await require.gameMember({
                data: {
                    gameId,
                    user
                }
            });
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
