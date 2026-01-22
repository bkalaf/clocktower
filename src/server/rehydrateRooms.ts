import type { Snapshot } from 'xstate';
import type { Room } from '@/types/room';
import type { RoomSnapshotDoc } from '@/server/models/RoomModel';
import { createRoomActor } from '@/server/roomService';
import { listRoomDocs } from '@/server/persistence/roomPersistence';

export async function rehydrateAllRooms() {
    const docs = await listRoomDocs();
    for (const doc of docs) {
        const room = docToRoom(doc);
        const snapshot = (doc.persistedSnapshot as Snapshot<unknown>) ?? undefined;
        try {
            createRoomActor(room, undefined, snapshot ? { snapshot } : undefined);
        } catch (error) {
            console.error('[rehydrateRooms] Unable to restart room actor', doc._id, error);
        }
    }
}

function docToRoom(doc: RoomSnapshotDoc): Room {
    return {
        _id: doc._id,
        allowTravellers: doc.allowTravellers,
        banner: doc.banner,
        connectedUserIds: extractConnectedIds(doc.connectedUserIds),
        endedAt: doc.endedAt,
        hostUserId: doc.hostUserId,
        maxPlayers: doc.maxPlayers,
        minPlayers: doc.minPlayers,
        maxTravellers: doc.maxTravellers,
        plannedStartTime: doc.plannedStartTime,
        scriptId: doc.scriptId,
        skillLevel: doc.skillLevel,
        speed: doc.speed,
        visibility: doc.visibility,
        storytellerUserIds: []
    };
}

function extractConnectedIds(value: RoomSnapshotDoc['connectedUserIds']) {
    if (Array.isArray(value)) {
        return value;
    }
    if (value && typeof value === 'object') {
        return Object.keys(value);
    }
    return [];
}
