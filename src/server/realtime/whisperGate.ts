// src/server/realtime/whisperGate.ts
import { MatchModel } from '@/db/models/Match';
import { WhisperModel } from '@/db/models/Whisper';

function toGameTopic(topicId: string) {
    if (topicId.startsWith('room:')) {
        return `game:${topicId.slice('room:'.length)}`;
    }
    return topicId;
}

export async function shouldAllowWhisper(roomId: string, topicId: string) {
    const match = await MatchModel.findOne({ roomId, status: 'in_progress' }).lean();
    if (!match) return true;

    const normalizedTopic = toGameTopic(topicId);
    const whisper = await WhisperModel.findOne({ topicId: normalizedTopic }).lean();
    if (!whisper) return true;

    if (match.phase === 'night') {
        return Boolean(whisper.meta?.includeStoryteller);
    }

    if (match.subphase !== 'day.private_conversations') {
        const name = whisper.meta?.name ?? '';
        return name.toLowerCase().includes('neighbor');
    }

    return true;
}
