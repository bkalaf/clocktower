// src/serverFns/requireRole.ts
import { createServerFn } from '@tanstack/react-start';
import { requireGameMember } from './requireGameMember';
import { zRequireRoleInput } from '../schemas';

export const requireMemberRole = createServerFn({
    method: 'GET'
})
    .inputValidator(zRequireRoleInput)
    .handler(async ({ data }) => {
        const result = await requireGameMember({
            data: {
                gameId: data.gameId,
                user: data.user
            }
        });
        if (result == null) {
            return null;
        }
        return result;
    });
