// src/serverFns/index.ts
import $chatItem from './$chatItem';
import $game from './$game';
import $gameMember from './$gameMember';
import $session from './$session';
import $whisper from './$whisper';
import { authorize } from './authorize';
import getId from './getId';
import require from './require';

const serverFns = {
    authorize,
    require: require,
    gameMember: $gameMember,
    session: $session,
    whisper: $whisper,
    game: $game,
    chatItem: $chatItem,
    getId
};

export default serverFns;
