// src/schemas/inputs/index.ts
import z from 'zod/v4';
import refs from '../refs';
import aliases from '../aliases';
import enums from '../enums';

const zId = z.uuid('Must be a UUID');
const zString = z.string().min(1);

const zAuthedUser = z.object({
    _id: aliases.gameId,
    name: aliases.name.meta({ description: 'Your displayed username.' }),
    email: aliases.email.meta({ description: 'Your e-mail (this is private and not shown to others).' }),
    userRoles: z.array(enums.globalRoles).min(1, 'Must have at least 1 role.').default(['user'])
});
const zFindGameMember = z.object({
    gameId: refs.game,
    user: zAuthedUser
});
const zRequireRoleInput = z.object({
    gameId: refs.game,
    user: zAuthedUser,
    role: enums.sessionRoles
});
const zFindChatItemByTopicAndStream = z.object({
    topicId: zId,
    streamId: zId
});

const inputs = {
    _id: zId,
    string: zString,
    chatItem: {
        byTopicAndStream: zFindChatItemByTopicAndStream
    },
    gameMember: {
        find: zFindGameMember
    },
    require: {
        role: zRequireRoleInput
    }
};

export default inputs;
