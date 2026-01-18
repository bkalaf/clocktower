// src/client/api/rooms.ts
export async function fetchRoom(roomId: string) {
    const response = await fetch(`/api/rooms/${roomId}`, { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Unable to load room data');
    }
    return response.json();
}
