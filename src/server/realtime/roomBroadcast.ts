// src/server/realtime/roomBroadcast.ts
import { getRedis } from '../../redis';
import { $keys } from '../../keys';

export async function broadcastRoomEvent(roomId: string, payload: unknown) {
    const redis = await getRedis();
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await Promise.all([
        redis.publish($keys.publicTopic(roomId), message),
        redis.publish($keys.stTopic(roomId), message),
        redis.publish($keys.roomPublicTopic(roomId), message),
        redis.publish($keys.roomStTopic(roomId), message)
    ]);
}

export async function broadcastRoomStEvent(roomId: string, payload: unknown) {
    const redis = await getRedis();
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await Promise.all([
        redis.publish($keys.stTopic(roomId), message),
        redis.publish($keys.roomStTopic(roomId), message)
    ]);
}

type NominationType = 'execution' | 'exile';
type VoteChoice = 'yes' | 'no' | 'abstain';

export type NominationEventPayload = {
    matchId: string;
    nominationType: NominationType;
    nominatorId: string;
    nomineeId: string;
};

export type NominationResolvedPayload = NominationEventPayload & {
    votesFor: number;
    threshold: number;
    passed: boolean;
    onTheBlockNomineeId?: string;
};

export type VoteHistoryRecord = {
    day: number;
    nominationType: NominationType;
    nominatorId: string;
    nomineeId: string;
    votesFor: number;
    threshold: number;
    passed: boolean;
    votes: Array<{
        voterId: string;
        choice: VoteChoice;
        usedGhost?: boolean;
    }>;
    ts: number;
};

export async function broadcastNominationOpened(roomId: string, payload: NominationEventPayload) {
    await broadcastRoomEvent(roomId, {
        kind: 'event',
        type: 'nominationOpened',
        ts: Date.now(),
        payload
    });
}

export async function broadcastNominationClosed(roomId: string, payload: NominationEventPayload) {
    await broadcastRoomEvent(roomId, {
        kind: 'event',
        type: 'nominationClosed',
        ts: Date.now(),
        payload
    });
}

export async function broadcastNominationResolved(roomId: string, payload: NominationResolvedPayload) {
    await broadcastRoomEvent(roomId, {
        kind: 'event',
        type: 'nominationResolved',
        ts: Date.now(),
        payload
    });
}

export async function broadcastNominationHistory(roomId: string, matchId: string, entry: VoteHistoryRecord) {
    await broadcastRoomStEvent(roomId, {
        kind: 'event',
        type: 'nominationHistory',
        ts: Date.now(),
        payload: { matchId, entry }
    });
}

// TODO: hook these helpers into the new nomination lifecycle so events reach the public and ST feeds without leaking voter-level data.
