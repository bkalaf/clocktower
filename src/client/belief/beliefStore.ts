// src/client/belief/beliefStore.ts
import { openDB, type DBSchema } from 'idb';

export type BeliefStateV1 = {
    version: 1;
    updatedAt: number;
    roomId: string;
    matchId: string;
    userId: string;
    notesBySeat: Record<string, string>;
    tokenBeliefsBySeat: Record<string, string>;
    reminderMarkers: Array<{ seatId: string; key: string; flipped?: boolean }>;
};

type BeliefKey = string;

interface BeliefDB extends DBSchema {
    belief: {
        key: BeliefKey;
        value: BeliefStateV1;
    };
}

const DB_NAME = 'clocktower-beliefs';
const DB_VERSION = 1;

function makeKey(roomId: string, matchId: string, userId: string): BeliefKey {
    return `${roomId}:${matchId}:${userId}`;
}

async function getDb() {
    return openDB<BeliefDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            db.createObjectStore('belief');
        }
    });
}

export async function loadBelief(roomId: string, matchId: string, userId: string): Promise<BeliefStateV1 | null> {
    const d = await getDb();
    return (await d.get('belief', makeKey(roomId, matchId, userId))) ?? null;
}

export async function saveBelief(state: BeliefStateV1): Promise<void> {
    const d = await getDb();
    state.updatedAt = Date.now();
    await d.put('belief', state, makeKey(state.roomId, state.matchId, state.userId));
}

export async function clearBelief(roomId: string, matchId: string, userId: string): Promise<void> {
    const d = await getDb();
    await d.delete('belief', makeKey(roomId, matchId, userId));
}

export function newBelief(roomId: string, matchId: string, userId: string): BeliefStateV1 {
    return {
        version: 1,
        updatedAt: Date.now(),
        roomId,
        matchId,
        userId,
        notesBySeat: {},
        tokenBeliefsBySeat: {},
        reminderMarkers: []
    };
}

export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
    let t: ReturnType<typeof setTimeout> | undefined;
    return (...args: Parameters<T>) => {
        if (t) clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}
