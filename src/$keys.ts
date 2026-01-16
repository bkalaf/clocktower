// src/$keys.ts
export const $keys = {
    publicTopic: function publicTopic(gameId: string) {
        return `game:${gameId}:public`;
    },
    stTopic: function stTopic(gameId: string) {
        return `game:${gameId}:st`;
    },
    whisperMembersKey: function whisperMembersKey(gameId: string, whisperId: string) {
        return `whisper:${gameId}:${whisperId}:members`;
    },
    userWhisperKey: function userWhispersKey(gameId: string, userId: string) {
        return `user:${userId}:whispers:${gameId}`;
    }
};

export const $is = {
    stTopic: function isStTopic(topic: string) {
        return topic.endsWith(':st');
    },
    publicTopic: function isPublicTopic(topic: string) {
        return topic.endsWith(':public');
    }
};

export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;
