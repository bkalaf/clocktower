// src/db/models/index.ts
import { UserModel } from './User';
import { SessionModel } from './Session';
import { GameModel } from './Game';
import { GameMemberModel } from './GameMember';
import { ChatItemModel } from './ChatItem';
import { WhisperModel } from './Whisper';
import { StreamMessageModel } from './StreamMessage';

const $models = {
    UserModel,
    SessionModel,
    GameModel,
    GameMemberModel,
    ChatItemModel,
    WhisperModel,
    StreamMessageModel
};

export default $models;
