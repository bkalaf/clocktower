// src/db/models/index.ts
import { UserModel } from './User';
import { SessionModel } from './Session';
import { GameModel } from './Game';
import { GameMemberModel } from './GameMember';
import { ChatItemModel } from './ChatItem';
import { WhisperModel } from './Whisper';

const $models = {
    UserModel,
    SessionModel,
    GameModel,
    GameMemberModel,
    ChatItemModel,
    WhisperModel
};

export default $models;
