// src/db/crud/User.ts
import { createServerFn } from '@tanstack/react-start';
import { zAuthedUser } from '../models/AuthedUser';
import { UserModel } from '../models/User';

const zUserOutput = zAuthedUser;

export const getUserByIdServerFn = createServerFn({
    method: 'GET'
})
    .inputValidator(z.string().min(1))
    .handler(async ({ data: _id }) => {
        return zUserOutput.parseAsync(await UserModel.findById(_id).lean());
    });
