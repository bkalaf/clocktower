// src/server/schemas/$z.ts
import sessionModels from '../../db/models/Session';
import gameMemberModels from '../../db/models/GameMember';

// export const $z = {
//     authUser: z.object({
//         _id: zUserId,
//         name: z.string().min(1, 'Name is required.'),
//         email: z.email('Invalid email.'),
//         userRoles: z.array(zGlobalRoles).min(1, 'User must have at least one role.')
//     }),
//     makeReadyInput: z.object({
//         isReady: z.boolean().default(false),
//         gameId: zGameId
//     }),
//     gameMember: {
//         type: zGameMember,
//         update: zUpdateGameMember
//     }
// };

export const $z = {
    gameMember: gameMemberModels,
    session: sessionModels
};
