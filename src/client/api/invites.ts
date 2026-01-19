// src/client/api/invites.ts
export async function fetchInvites() {
    console.log(`fetchInvites called`);
    const response = await fetch('/api/invites', { credentials: 'include' });
    if (!response.ok) {
        throw new Error('Unable to load invites');
    }
    return response.json();
}

async function postInviteAction(inviteId: string, action: 'accept' | 'reject') {
    const response = await fetch(`/api/invites/${inviteId}/${action}`, {
        method: 'POST',
        credentials: 'include'
    });
    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Request failed');
    }
    return response.json();
}

export function acceptInvite(inviteId: string) {
    return postInviteAction(inviteId, 'accept');
}

export function rejectInvite(inviteId: string) {
    return postInviteAction(inviteId, 'reject');
}
