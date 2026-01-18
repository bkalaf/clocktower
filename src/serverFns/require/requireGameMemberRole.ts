// src/serverFns/require/requireGameMemberRole.ts
import { createServerFn } from '@tanstack/react-start';
import { requireGameMember } from './requireGameMember';
import inputs from '../../schemas/inputs';

export const requireGameMemberRole = createServerFn({
    method: 'GET'
})
    .inputValidator(inputs.require.role)
    .handler(async ({ data }) => {
        const result = await requireGameMember({
            data: {
                gameId: data.gameId,
                user: data.user
            }
        });
        if (result == null) {
            throw new Error('no gameMember found');
        }
        if (result.role !== data.role) {
            throw new Error('role mismatch');
        }
        return result;
    });
