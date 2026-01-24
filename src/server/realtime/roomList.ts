// src/server/realtime/roomList.ts
import { RoomSummary } from '@/shared/realtime/messages';

import { roomActors } from '../roomService';

export function getRoomSummaries(): RoomSummary[] {
    const summaries: RoomSummary[] = [];

    for (const [roomId, actor] of roomActors.entries()) {
        try {
            const snapshot = actor.getSnapshot();
            const context = snapshot.context;
            const room = context?.room;
            if (!room) {
                summaries.push({ roomId, playerCount: 0 });
                continue;
            }
            const connected = room.connectedUserIds ?? {};
            const playerCount = Object.keys(connected).length;
            summaries.push({
                roomId: room._id ?? roomId,
                playerCount,
                name: room.banner || undefined,
                status: snapshot?.value?.roomStatus
            });
        } catch {
            summaries.push({ roomId, playerCount: 0 });
        }
    }

    return summaries;
}
