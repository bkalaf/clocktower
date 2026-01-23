// src/server/persistence/snapshotToDoc.ts
import { ActorRefFrom } from 'xstate';
import { createRoomMachine } from '../machines/RoomMachine';

/**
 * Convert a running RoomMachine actor into the flattened persistence shape.
 * Assumes the actor snapshot context includes:
 *   context.room (Room)
 *   context.acceptingPlayers
 *   context.currentMatchId
 *   context.readyByUserId
 *   context.storytellerMode
 */
export function snapshotToUpsertArgs(actor: ActorRefFrom<typeof createRoomMachine>): UpsertRoomArgs {
    const snap = actor.getSnapshot() as RoomSnapshotPayload;
    const r = snap.context.room;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const persistedSnapshot = actor.getPersistedSnapshot() as any as RoomSnapshotPayload;

    return {
        _id: r._id,

        // Room fields
        allowTravellers: r.allowTravellers,
        banner: r.banner,
        connectedUserIds: r.connectedUserIds ?? {},
        endedAt: r.endedAt,
        hostUserId: r.hostUserId,
        maxPlayers: r.maxPlayers,
        minPlayers: r.minPlayers,
        maxTravellers: r.maxTravellers,
        plannedStartTime: r.plannedStartTime,
        scriptId: r.scriptId,
        skillLevel: r.skillLevel,
        speed: r.speed,
        visibility: r.visibility,

        // Extras
        acceptingPlayers: snap.context.acceptingPlayers,
        currentMatchId: snap.context.currentMatchId,
        readyByUserId: snap.context.readyByUserId ?? {},
        storytellerMode: snap.context.storytellerMode,

        // Snapshot metadata
        stateValue: snap.value,
        persistedSnapshot
    };
}
