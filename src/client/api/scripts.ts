// src/client/api/scripts.ts
export async function fetchScripts() {
    const response = await fetch('/api/scripts', { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Unable to load scripts');
    }
    return response.json();
}

export async function setRoomScript(roomId: string, scriptId: string) {
    const response = await fetch(`/api/rooms/${roomId}/script`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId })
    });
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || 'Failed to set script');
    }
    return response.json();
}
