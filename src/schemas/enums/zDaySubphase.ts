// src/schemas/enums/zDaySubphase.ts
import z from 'zod/v4';

export const zDaySubphase = z.enum([
    'dawn_announcements',
    'private_conversations',
    'public_conversations',
    'nominations_open',
    'nomination_voting',
    'execution_resolution'
]);
