// src/db/models/index.ts
import { UserModel } from './User';
import { SessionModel } from './Session';
import { GameModel } from './Game';
import { GameMemberModel } from './GameMember';
import { ChatItemModel } from './ChatItem';
import { WhisperModel } from './Whisper';
import { StreamMessageModel } from './StreamMessage';
import { ScriptModel } from './Script';
import { MatchModel } from './Match';
import { InviteModel } from './Invite';
import { ModerationLogModel } from './ModerationLog';
import { TravelerRequestModel } from './TravelerRequest';

const $models = {
    UserModel,
    SessionModel,
    GameModel,
    GameMemberModel,
    ChatItemModel,
    WhisperModel,
    StreamMessageModel,
    ScriptModel,
    MatchModel,
    InviteModel,
    ModerationLogModel,
    TravelerRequestModel
};

export default $models;
