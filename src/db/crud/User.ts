// src/db/crud/User.ts
import { createServerFn } from '@tanstack/react-start';
import { zAuthedUser, type AuthedUser } from '../models/AuthedUser';
import { UserModel } from '../models/User';
import z from 'zod/v4';

const zUserOutput = zAuthedUser;

export const getUserByIdServerFn = createServerFn<'GET', AuthedUser>({
    method: 'GET'
})
    .inputValidator(z.string().min(1))
    .handler(async ({ data: _id }) => {
        return zUserOutput.parseAsync(await UserModel.findById(_id).lean());
    });
