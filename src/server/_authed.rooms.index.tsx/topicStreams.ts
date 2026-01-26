// src/server/realtime/topicStreams.ts
const STREAM_KEY_PREFIX = 'stream:';
const ROOM_TOPIC_PREFIX = 'room:';
const LEGACY_GAME_TOPIC_PREFIX = 'game:';

export function streamKeyForTopic(topic: string) {
    return `${STREAM_KEY_PREFIX}${topic}`;
}

export function timestampFromStreamId(streamId: string) {
    const [msPart] = streamId.split('-');
    const timestamp = Number(msPart);
    if (!Number.isFinite(timestamp)) {
        throw new Error(`Invalid Redis stream ID "${streamId}"`);
    }
    return timestamp;
}

export function getRoomIdFromTopic(topic: string) {
    if (topic.startsWith(ROOM_TOPIC_PREFIX)) {
        const [, roomId] = topic.split(':');
        if (roomId) return roomId;
    }
    if (topic.startsWith(LEGACY_GAME_TOPIC_PREFIX)) {
        const [, gameId] = topic.split(':');
        if (gameId) return gameId;
    }
    return null;
}

export function getMatchIdFromTopic(topic: string) {
    if (!topic.startsWith(ROOM_TOPIC_PREFIX)) return null;
    const parts = topic.split(':');
    const matchIndex = parts.indexOf('match');
    if (matchIndex === -1 || parts.length <= matchIndex + 1) return null;
    return parts[matchIndex + 1];
}
