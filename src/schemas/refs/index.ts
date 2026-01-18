// src/schemas/refs/index.ts
import aliases, { $coll } from '../aliases';
import z from 'zod/v4';

const zodUUID = z.string('Must be a UUID').meta({ ref: 'any' });

const toRef = (coll: keyof typeof $coll, alias: keyof typeof aliases): typeof zodUUID => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return aliases[alias].meta({ $ref: $coll[coll], description: `a foreign key to the ${$coll[coll]} table` }) as any;
};

const refs = {
    game: toRef('game', 'gameId'),
    gameMember: toRef('gameMember', 'gameMemberId'),
    chatItem: toRef('chatItem', 'chatItemId'),
    topic: toRef('topic', 'topicId'),
    whisper: toRef('whisper', 'whisperId'),
    session: toRef('session', 'sessionId'),
    user: toRef('user', 'userId'),
    stream: toRef('stream', 'streamId'),
    script: toRef('script', 'scriptId'),
    match: toRef('match', 'matchId'),
    invite: toRef('invite', 'inviteId'),
    moderationLog: toRef('moderationLog', 'moderationLogId'),
    travelerRequest: toRef('travelerRequest', 'travelerRequestId')
    // Additional refs can be added as needed
};

export default refs;
