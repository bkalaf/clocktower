// src/serverFns/require/requireRole.ts
import { createServerFn } from '@tanstack/react-start';
import { zRequireRoleInput } from '../../schemas';
import { requireGameMember } from './requireGameMember';

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
