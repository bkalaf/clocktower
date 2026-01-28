// src/server/auth/privileged.ts
import { HttpError } from '../../errors';
import type { AuthedUser, GlobalRoles } from '../../types/game';
import { getSessionCookie } from './cookies';

const PRIVILEGED_ROLES: Set<GlobalRoles> = new Set(['admin', 'moderator']);

export function hasPrivilegedRole(user: AuthedUser | null | undefined): user is AuthedUser {
    if (!user || !Array.isArray(user.userRoles)) return false;
    return user.userRoles.some((role) => PRIVILEGED_ROLES.has(role));
}

export async function requirePrivilegedUser(): Promise<AuthedUser> {
    const user = await getSessionCookie();
    if (!user) {
        throw HttpError.UNAUTHORIZED('missing_session');
    }
    if (!hasPrivilegedRole(user)) {
        throw HttpError.FORBIDDEN('insufficient_role');
    }
    return user;
}
