// src/serverFns/whoAmI.ts
import { createServerFn } from '@tanstack/react-start';
import { getUserFromCookie } from './getUserFromCookie';
import { redirect } from '@tanstack/react-router';

export const whoAmIServerFn = createServerFn({
    method: 'GET'
}).handler(async ({}) => {
    const result = await getUserFromCookie();
    if (result == null) throw redirect({ to: '/login' });
    return result;
});
