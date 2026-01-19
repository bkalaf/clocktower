// src/client/api/matches.ts
import type { Match } from '@/types/match';

export async function fetchMatch(matchId: string): Promise<Match> {
    const response = await fetch(`/api/matches/${matchId}`, { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Unable to load match data');
    }
    return response.json();
}
