// src/serverFns/require/index.ts

import { requireGameMember } from './requireGameMember';
import { requireMemberRole } from './requireRole';

const require = {
    gameMember: requireGameMember,
    role: requireMemberRole
}