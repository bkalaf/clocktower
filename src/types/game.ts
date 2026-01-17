// src/types/game.ts
export type UserId = string;
export type GameId = string;
export type WhisperId = string;
export type SessionId = string;
export type StreamId = string;
export type Snapshot = object;
export type GameMemberId = `${GameId}:${UserId}`;
export type TopicId = `game:${GameId}:whisper:${WhisperId}`;
export type ChatItemId = string;
export type GlobalRoles = 'moderator' | 'user' | 'admin';
export type GameRoles = 'player' | 'storyteller' | 'spectator';
export type TopicTypes = 'public' | 'st' | 'whisper';

export type CursorMap = Record<string, string>;
export const CURSORS_KEY = (gameId: string) => `botc:cursors:${gameId}`;

export interface User {
    _id: UserId;
    name: string;
    email: string;
    passwordHash: string;
    userRoles: GlobalRoles[];
}

export type AuthedUser = Omit<User, 'passwordHash'>;
export type GameStatus = 'idle' | 'playing' | 'reveal' | 'setup' | 'ended';
export type GameSpeed = 'fast' | 'moderate' | 'slow';
export type SkillLevel = 'novice' | 'intermediate' | 'advanced' | 'expert';

export type Editions = 'tb' | 'bmr' | 'snv';

export interface LobbySettings {
    minPlayers?: number;
    maxPlayers?: number;
    canTravel: boolean;
    edition?: Editions;
    skillLevel?: SkillLevel;
    plannedStartTime?: Date;
}

export interface Game {
    _id: GameId; // gameId
    version: number;
    snapshot: Snapshot;
    hostUserId: UserId;
    status: GameStatus;
    endedAt?: number;
    lobbySettings: LobbySettings;
}

export interface Session {
    _id: SessionId;
    userId: UserId;
    expiresAt: number;
}

export interface GameMember {
    _id: GameMemberId; // `${gameId}:${userId}`
    gameId: GameId;
    userId: UserId;
    role: GameRoles;
    joinedAt: number;
    isSeated: boolean;
}

export interface Whisper {
    _id: WhisperId; // whisperId
    gameId: GameId;
    topicId: TopicId;
    members: UserId[];
    creator: UserId;
    isActive: boolean;
    meta?: {
        name?: string;
        includeStoryteller?: boolean;
    };
}

export interface ChatMsg {
    kind: 'chat';
    id: string;
    ts: number;
    from: { userId: UserId; name: string };
    text: string;
}

export interface ChatItem {
    _id: ChatItemId;
    from: { userId: UserId; name: string };
    gameId: GameId;
    topicId: TopicId;
    text: string;
    ts: number;
    streamId: StreamId;
}

export interface TrackState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: any | null;
    version: number;
    haveSnapshot: boolean;
    buffer: AppEvents[];
}

export type SnapshotMsg = {
    kind: 'snapshot';
    id: string;
    ts: number;
    version: number;
    snapshot: Snapshot;
};

export type EventOperations =
    | 'st/setReminderToken'
    | 'st/phaseChanged'
    | 'st/assignSeat'
    | 'st/assignToken'
    | 'st/wakePlayer'
    | 'st/makeAChoice'
    | 'st/TheseAreYouMinions'
    | 'st/ThisIsTheDemon'
    | 'st/TheseRolesAreNotInPlay'
    | 'st/SetupComplete'
    | 'game/night'
    | 'game/day'
    | 'game/startTimer'
    | 'game/endTimer'
    | 'game/pauseTimer'
    | 'game/resumeTimer'
    | 'game/timerExpired';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMsg<TOperation extends EventOperations = EventOperations, TArgs = any> = {
    kind: 'event';
    id: string;
    ts: number;
    op: TOperation;
    payload: TArgs;
    version?: number;
};

export type GameEvents =
    | EventMsg<'st/phaseChanged', void>
    | EventMsg<'st/setReminderToken', { key: string; sourceId: number; targetId: number; isChanneled: boolean }>
    | EventMsg<'st/assignSeat', { seatId: number; userId: AuthedUser }>
    | EventMsg<'game/day', void>
    | EventMsg<'game/night', void>
    | EventMsg<'game/startTimer', { min?: number }>
    | EventMsg<'game/endTimer', void>
    | EventMsg<'game/timerExpired', void>;

export type AppEvents = ChatMsg | GameEvents | SnapshotMsg;
