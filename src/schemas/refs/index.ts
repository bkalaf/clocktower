// src/schemas/refs/index.ts
import aliases, { $coll } from '../aliases';

const toRef = (coll: keyof typeof $coll, alias: keyof typeof aliases) => {
    return aliases[alias].meta({ $ref: $coll[coll], description: `a foreign key to the ${$coll[coll]} table` });
};

const refs = {
    game: toRef('game', 'gameId'),
    gameMember: toRef('gameMember', 'gameMemberId'),
    chatItem: toRef('chatItem', 'chatItemId'),
    topic: toRef('topic', 'topicId'),
    whisper: toRef('whisper', 'whisperId'),
    session: toRef('session', 'sessionId'),
    user: toRef('user', 'userId'),
    stream: toRef('stream', 'streamId')
};

export default refs;
