// src/keys.ts
import { GameId } from './types/game';

export const $keys = {
    publicTopic: (gameId: GameId) => `game:${gameId}:public`,
    stTopic: (gameId: GameId) => `game:${gameId}:st`,
    roomPublicTopic: (gameId: GameId) => `room:${gameId}:public`,
    roomStTopic: (gameId: GameId) => `room:${gameId}:st`,
    whisperMembersKey: (gameId: GameId, whisperId: string) => `whisper:${gameId}:${whisperId}:members`,
    userWhisperKey: (gameId: GameId, userId: string) => `user:${userId}:whispers:${gameId}`,
    presenceKey: (gameId: GameId) => `presence:${gameId}`,
    graceKey: (gameId: GameId) => `hostGrace:${gameId}`,
    reminderKey: (gameId: GameId) => `reminder:pickST:${gameId}`
};

export const $is = {
    stTopic: (topic: string) => topic.endsWith(':st'),
    publicTopic: (topic: string) => topic.endsWith(':public')
};

export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
