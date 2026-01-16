// src/server/requireRole.ts
import { HttpError } from '../errors';
import { AuthedUser, GameRoles } from '../types/game';
import { requireGameMember } from './requireGameMember';

export async function requireRole(gameId: string, user: AuthedUser, roles: GameRoles[]) {
    const member = await requireGameMember(gameId, user);
    if (!roles.includes(member.role)) {
        throw HttpError.FORBIDDEN('FORBIDDEN: Insufficient role');
    }
    return member;
}
