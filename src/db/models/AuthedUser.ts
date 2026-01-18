// src/db/models/AuthedUser.ts
import z from 'zod/v4';
import schemas from '../../schemas/index';
const { aliases, enums } = schemas;

export const zAuthedUser = z.object({
    _id: z.string('Must be a UUID'),
    name: aliases.name.meta({ description: 'Your displayed username.' }),
    email: aliases.email.meta({ description: 'Your e-mail (this is private and not shown to others).' }),
    userRoles: z.array(enums.globalRoles).min(1, 'Must have at least 1 role.').default(['user'])
        .meta({ description: 'Roles granted to this user.' }),
    penaltyUntil: aliases.timestamp.optional().nullable()
});

export type AuthedUser = z.infer<typeof zAuthedUser>;
