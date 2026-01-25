// src/db/models/index.ts
import { UserModel } from './User';
import { GameModel } from './_Game';
import { GameMemberModel } from './GameMember';
import { ChatItemModel } from './ChatItem';
import { WhisperModel } from './Whisper';
import { StreamMessageModel } from './StreamMessage';
import { ScriptModel } from './Script';
import { MatchModel } from './Game';
import { InviteModel } from './Invite';
import { ModerationLogModel } from './ModerationLog';
import { TravellerRequestModel } from './TravellerRequest';

const $models = {
    UserModel,
    GameModel,
    GameMemberModel,
    ChatItemModel,
    WhisperModel,
    StreamMessageModel,
    ScriptModel,
    MatchModel,
    InviteModel,
    ModerationLogModel,
    TravellerRequestModel
};

export default $models;
