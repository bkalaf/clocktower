// src/server/realtime/roomList.ts
import { getScriptById } from '../../db/crud/Script';
import { getUserById } from '../../db/crud/User';
import { roomActors } from '../roomService';

export async function getRoomSummary(room: Room): Promise<RoomSummary> {
    const hostUser = await getUserById({ data: room.hostUserId });
    const script = await getScriptById({ data: room.scriptId });

    return {
        roomId: room._id,
        banner: room.banner,
        hostUserId: room.hostUserId,
        hostUsername: hostUser?.username,
        scriptId: room.scriptId,
        scriptName: script?.name,
        speed: room.speed,
        visibility: room.visibility,
        roles: script?.roles ?? [],
        skillLevel: room.skillLevel,
        maxPlayers: room.maxPlayers,
        minPlayers: room.minPlayers,
        maxTravellers: room.maxTravellers,
        allowTravellers: room.allowTravellers,
        plannedStartTime: room.plannedStartTime?.toISOString() ?? undefined,
        connectedUserIds: room.connectedUserIds ?? {},
        playerCount: Object.keys(room.connectedUserIds ?? {}).length
    };
}
export async function getRoomSummaries(): Promise<RoomSummary[]> {
    const summaries: RoomSummary[] = [];

    for await (const element of Object.entries(roomActors).map(async ([rId, actor]) => {
        const snapshot = actor.getSnapshot();
        const context = snapshot.context;
        const room = context?.room;
        if (!room) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { roomId: rId, playerCount: 0 } as any;
        }
        const result = await getRoomSummary(room);
        return result;
    })) {
        summaries.push(element);
    }

    // for (const [roomId, actor] of roomActors.entries()) {
    //     try {
    //         const snapshot = actor.getSnapshot();
    //         const context = snapshot.context;
    //         const room = context?.room;
    //         if (!room) {
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             summaries.push({ roomId, playerCount: 0 } as any);
    //             continue;
    //         }
    //         const hostUserId = room.hostUserId;
    //         const scriptId = room.scriptId;

    //         const connected = room.connectedUserIds ?? {};
    //         const playerCount = Object.keys(connected).length;
    //         summaries.push({
    //             roomId: room._id ?? roomId,
    //             playerCount,
    //             name: room.banner || undefined,
    //             status: snapshot?.value?.roomStatus,
    //             allowTravellers: room.allowTravellers,
    //             connectedUserIds: connected,
    //             hostUserId: room.hostUserId
    //         });
    //     } catch {
    //         summaries.push({ roomId, playerCount: 0 });
    //     }
    // }

    return summaries;
}
