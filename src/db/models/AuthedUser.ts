// src/db/models/AuthedUser.ts
import z from 'zod/v4';
import schemas from '../../schemas/index';
import { zUserSettings } from '../../schemas/settings';
const { aliases, enums } = schemas;

export const zAuthedUser = z.object({
    _id: z.string('Must be a UUID'),
    username: aliases.name.meta({ description: 'Your displayed username.' }),
    displayName: aliases.name.optional().meta({ description: 'Optional human-friendly name.' }),
    email: aliases.email.meta({ description: 'Your e-mail (this is private and not shown to others).' }),
    avatarPath: z.string().min(1).optional(),
    userRoles: z
        .array(enums.globalRoles)
        .min(1, 'Must have at least 1 role.')
        .default(['user'])
        .meta({ description: 'Roles granted to this user.' }),
    penaltyUntil: aliases.timestamp.optional().nullable(),
    settings: zUserSettings
});

export type AuthedUser = z.infer<typeof zAuthedUser>;
