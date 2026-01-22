import { randomUUID } from 'crypto';
import { createActor, type ActorRefFrom, type Snapshot } from 'xstate';
import type { Room } from '@/types/room';
import { machine as roomMachine, type RoomContext } from '@/machines/RoomMachine';
import type { SnapshotMsg } from '@/types/game';
import { publish } from '@/server/realtime/publish';
import { $keys } from '@/keys';
import { snapshotToUpsertArgs } from '@/server/persistence/snapshotToDoc';
import { upsertRoomSnapshot } from '@/server/persistence/roomPersistence';

const CRITICAL_EVENTS = new Set(['MATCH_STARTED', 'MATCH_ENDED', 'ARCHIVE_ROOM', 'MATCH_RESET']);
const PERSIST_DEBOUNCE_MS = 250;

export type RoomSnapshot = { value: unknown; context: RoomContext };
export type RoomSnapshotBroadcaster = (args: { roomId: string; snapshot: RoomSnapshot }) => Promise<void>;

const roomActors = new Map<string, ActorRefFrom<typeof roomMachine>>();
const persistenceTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const broadcastRoomSnapshot: RoomSnapshotBroadcaster = async ({ roomId, snapshot }) => {
    const message: SnapshotMsg = {
        kind: 'snapshot',
        id: randomUUID(),
        ts: Date.now(),
        version: 0,
        snapshot
    };
    const topics = [
        $keys.publicTopic(roomId),
        $keys.stTopic(roomId),
        $keys.roomPublicTopic(roomId),
        $keys.roomStTopic(roomId)
    ];
    try {
        await Promise.all(topics.map((topic) => publish(topic, message)));
    } catch (error) {
        console.error('[roomService] Failed to publish room snapshot', roomId, error);
    }
};

export type CreateRoomActorOptions = {
    snapshot?: Snapshot<unknown>;
};

export function createRoomActor(
    room: Room,
    broadcast: RoomSnapshotBroadcaster = broadcastRoomSnapshot,
    options?: CreateRoomActorOptions
) {
    if (roomActors.has(room._id)) {
        return roomActors.get(room._id)!;
    }

    const machine = createRoomMachine(room);
    const actorOptions = options?.snapshot ? { snapshot: options.snapshot } : undefined;
    const actor = createActor(machine, actorOptions);

    actor.subscribe((state) => {
        const payload = { roomId: room._id, snapshot: { value: state.value, context: state.context } };
        void broadcast(payload).catch((error) => {
            console.error('[roomService] Snapshot broadcast error', room._id, error);
        });

        const eventType = state.event?.type;
        if (eventType && CRITICAL_EVENTS.has(eventType)) {
            void persistSnapshot(actor, room._id);
            return;
        }
        schedulePersistence(actor, room._id);
    });

    roomActors.set(room._id, actor);
    actor.start();
    void persistSnapshot(actor, room._id);
    return actor;
}

export function getRoomActor(roomId: string) {
    return roomActors.get(roomId);
}

function createRoomMachine(room: Room) {
    const baseContext = roomMachine.getInitialState().context;
    const connectedUserIds = Array.isArray(room.connectedUserIds) ? room.connectedUserIds : [];
    const storytellerUserIds =
        Array.isArray(room.storytellerUserIds) ? room.storytellerUserIds : baseContext.storytellerUserIds;
    const plannedStartTime = room.plannedStartTime ?? baseContext.plannedStartTime;

    const context: RoomContext = {
        ...baseContext,
        _id: room._id,
        allowTravellers: room.allowTravellers,
        banner: room.banner ?? baseContext.banner,
        connectedUserIds,
        endedAt: room.endedAt ?? baseContext.endedAt,
        hostUserId: room.hostUserId,
        maxPlayers: room.maxPlayers,
        minPlayers: room.minPlayers,
        maxTravellers: room.maxTravellers,
        plannedStartTime,
        scriptId: room.scriptId,
        skillLevel: room.skillLevel ?? baseContext.skillLevel,
        speed: room.speed,
        visibility: room.visibility,
        storytellerUserIds,
        storytellerCount: storytellerUserIds.length
    };

    return roomMachine.withContext(context);
}

function schedulePersistence(actor: ActorRefFrom<typeof roomMachine>, roomId: string) {
    const existing = persistenceTimers.get(roomId);
    if (existing) {
        clearTimeout(existing);
    }
    const timer = setTimeout(() => {
        persistenceTimers.delete(roomId);
        void persistSnapshot(actor, roomId);
    }, PERSIST_DEBOUNCE_MS);
    persistenceTimers.set(roomId, timer);
}

async function persistSnapshot(actor: ActorRefFrom<typeof roomMachine>, roomId: string) {
    const timer = persistenceTimers.get(roomId);
    if (timer) {
        clearTimeout(timer);
        persistenceTimers.delete(roomId);
    }

    try {
        const args = snapshotToUpsertArgs(actor);
        await upsertRoomSnapshot(args);
    } catch (error) {
        console.error('[roomService] Failed to persist snapshot', roomId, error);
    }
}
