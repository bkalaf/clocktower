// src/server/roomService.ts
import { ActorRefFrom, createActor } from 'xstate';
import _ from 'lodash';
import { createRoomMachine } from './machines/RoomMachine';
import { upsertRoomSnapshot } from './persistence/roomPersistence';
import { snapshotToUpsertArgs } from './persistence/snapshotToDoc';

type Broadcast = (msg: unknown) => void;

// In-memory: roomId -> RoomMachine actor
export const roomActors = new Map<string, ActorRefFrom<typeof createRoomMachine>>();

export function getRoomActor(roomId: string) {
    console.log(`roomId`, roomId);
    console.log(`hasRoomId`, roomActors.has(roomId));
    console.log(`result`, roomActors.get(roomId));
    return roomActors.get(roomId);
}

function shouldFlush(event: RoomEvents) {
    return (
        event.type === 'MATCH_STARTED' ||
        event.type === 'MATCH_ENDED' ||
        event.type === 'ARCHIVE_ROOM' ||
        event.type === 'MATCH_RESET'
    );
}

/**
 * Create and start a RoomMachine actor, wire:
 * - broadcast snapshots to all subscribers (via broadcast hook)
 * - persist snapshots to Mongo (debounced, plus immediate flush on critical events)
 */
export function createRoomActor(room: Room, broadcast: Broadcast) {
    const machine = createRoomMachine(room);
    const actor = createActor(machine, {
        input: { room }
    });
    actor.start();

    roomActors.set(room._id, actor);

    const persistDebounced = _.debounce(async () => {
        await upsertRoomSnapshot(snapshotToUpsertArgs(actor));
    }, 250);

    // Broadcast + persist on every transition
    actor.subscribe((snap: RoomSnapshotPayload) => {
        broadcast({
            type: 'ROOM_SNAPSHOT',
            roomId: snap.context.room._id,
            snapshot: { value: snap.value, context: snap.context }
        });
        persistDebounced();
    });

    // Intercept send to optionally flush persistence for critical events
    // const originalSend = actor.send.bind(actor);
    // actor.send = (event: RoomEvents) => {
    //     originalSend(event);
    //     if (shouldFlush(event)) {
    //         persistDebounced.flush?.();
    //         void upsertRoomSnapshot(snapshotToUpsertArgs(actor));
    //     }
    // };

    // Persist initial snapshot immediately
    void upsertRoomSnapshot(snapshotToUpsertArgs(actor));

    return actor;
}
