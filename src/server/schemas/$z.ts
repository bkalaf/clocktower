// src/server/schemas/$z.ts
import z from 'zod';
import { zUserId, zGlobalRoles } from '../../schemas';

export const $z = {
    authUser: z.object({
        _id: zUserId,
        name: z.string().min(1, 'Name is required.'),
        email: z.email('Invalid email.'),
        userRoles: z.array(zGlobalRoles).min(1, 'User must have at least one role.')
    })
};
