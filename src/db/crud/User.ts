// src/db/crud/User.ts
import z from 'zod/v4';
import aliases from '../../schemas/aliases';
import enums from '../../schemas/enums';
import { createServerFn } from '@tanstack/react-start';
import { UserModel } from '../models/User';

const zUserOutput = z.object({
    _id: z.string('Must be a UUID'),
    username: aliases.name.meta({ description: 'Your displayed username.' }),
    email: aliases.email.meta({ description: 'Your e-mail (this is private and not shown to others).' }),
    userRoles: z
        .array(enums.globalRoles)
        .min(1, 'Must have at least 1 role.')
        .default(['user'])
        .meta({ description: 'Roles granted to this user.' })
});

export const getUserById = createServerFn({
    method: 'GET'
})
    .inputValidator(z.string().min(1))
    .handler(async ({ data: _id }) => {
        return zUserOutput.parseAsync(await UserModel.findById(_id).lean());
    });
