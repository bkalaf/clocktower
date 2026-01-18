// src/serverFns/require/index.ts
import { requireGameMember } from './requireGameMember';
import { requireGameMemberRole } from './requireGameMemberRole';

const require = {
    gameMember: requireGameMember,
    gameMemberRole: requireGameMemberRole
};

export default require;
