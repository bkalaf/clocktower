// src/routes/_authed/privilegedLoader.ts
import { redirect } from '@tanstack/react-router';
import { HttpError } from '@/errors';
import type { AuthedUser } from '@/types/game';
import { whoamiPrivilegedFn } from '@/lib/api';

export async function loadPrivilegedUser(): Promise<AuthedUser> {
    try {
        const data = await whoamiPrivilegedFn();
        if (!data.user) {
            redirect({ to: '/login' });
        }
        return data.user;
    } catch (error) {
        if (error instanceof HttpError) {
            const isAuthError = error.status === 401;
            redirect({ to: isAuthError ? '/login' : '/' });
        }
        throw error;
    }
}
