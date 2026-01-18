// src/schemas/aliases/index.ts

import { zPassword } from './zPassword';
import { zVersion } from './zVersion';
import { zTimestamp } from './zTimestamp';
import { zEmail } from './zEmail';
import { zGameId } from './zGameId';
import { zUserId } from './zUserId';
import { zSessionId } from './zSessionId';
import { zPCTravelerCount } from './zPCTravelerCount';
import { zPCPlayerCount } from './zPCPlayerCount';
import { zTopicId } from './zTopicId';
import { zWhisperId } from './zWhisperId';
import { zChatItemId } from './zChatItemId';
import { zName } from './zName';
import { zGameMemberId } from './zGameMemberId';
import z from 'zod/v4';

export const zStreamId = z.uuid('Must be a UUID');
export const zSnapshot = z.any();

export const $coll = {
    game: 'game',
    gameMember: 'game_member',
    chatItem: 'chat_item',
    whisper: 'whisper',
    topic: 'topic',
    session: 'session',
    user: 'user',
    stream: 'stream'
};

const aliases = {
    chatItemId: z.string('Must be a UUID'),
    email: zEmail,
    gameId: z.string('Must be a UUID'),
    gameMemberId: z.string('Must be a UUID'),
    name: zName,
    password: zPassword,
    pcPlayerCount: zPCPlayerCount,
    pcTraverCount: zPCTravelerCount,
    sessionId: z.string('Must be a UUID'),
    snapshot: zSnapshot,
    streamId: z.string('Must be a UUID'),
    timestamp: zTimestamp,
    topicId: z.string('Must be a UUID'),
    userId: z.string('Must be a UUID'),
    version: zVersion,
    whisperId: z.string('Must be a UUID')
};

export default aliases;
