// src/client/api/rooms.ts
import type { GameRoles } from '@/types/game';
import type { Match } from '@/types/match';
import type { Room } from '@/types/room';

export type RoomPayload = {
    room: Room;
    memberRole: GameRoles;
    storytellerCount: number;
};

export async function fetchRoom(roomId: string): Promise<RoomPayload> {
    console.log(`fetchRoom called for roomId: ${roomId}`);
    if (roomId == null) {
        throw new Error('roomId is required');
    }
    const response = await fetch(`/api/rooms/${roomId}`, { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Unable to load room data');
    }
    return response.json();
}

export async function fetchCurrentMatch(roomId: string): Promise<Match> {
    const response = await fetch(`/api/rooms/${roomId}/match`, { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Unable to load match data');
    }
    return response.json();
}
