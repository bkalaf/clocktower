// src/server/rehydrateRooms.ts
import { createActor } from 'xstate';
import { roomActors } from './roomService';
import { createRoomMachine } from './machines/RoomMachine';
import { RoomModel } from './models/RoomModel';
import { upsertRoomSnapshot } from './persistence/roomPersistence';
import { snapshotToUpsertArgs } from './persistence/snapshotToDoc';

type Broadcast = (msg: unknown) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToRoom(doc: any): Room {
    return {
        _id: doc._id,
        allowTravellers: doc.allowTravellers,
        banner: doc.banner,
        connectedUserIds: doc.connectedUserIds ?? {},
        endedAt: doc.endedAt,
        hostUserId: doc.hostUserId,
        maxPlayers: doc.maxPlayers,
        minPlayers: doc.minPlayers,
        maxTravellers: doc.maxTravellers,
        plannedStartTime: doc.plannedStartTime,
        scriptId: doc.scriptId,
        skillLevel: doc.skillLevel,
        speed: doc.speed,
        visibility: doc.visibility
    };
}

/**
 * Rehydrate all room actors on server startup:
 * - Load docs from Mongo (backup)
 * - Recreate RoomMachine actors from `persistedSnapshot`
 * - Wire broadcast + persistence just like fresh actors
 */
export async function rehydrateAllRooms(broadcast: Broadcast) {
    const docs = await RoomModel.find({}).lean().exec();

    for (const doc of docs) {
        const room = docToRoom(doc);
        const machine = createRoomMachine(room);

        // XState v5: rehydrate actor from persisted snapshot
        const actor = createActor(machine, { snapshot: doc.persistedSnapshot, input: { room } });
        actor.start();

        roomActors.set(doc._id, actor);

        // Broadcast + persist on every transition
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        actor.subscribe((snap: any) => {
            broadcast({
                type: 'ROOM_SNAPSHOT',
                roomId: snap.context.room._id,
                snapshot: { value: snap.value, context: snap.context }
            });
            void upsertRoomSnapshot(snapshotToUpsertArgs(actor));
        });

        // Optional: immediately re-upsert (helps migrations/normalization)
        void upsertRoomSnapshot(snapshotToUpsertArgs(actor));
    }

    return roomActors;
}
