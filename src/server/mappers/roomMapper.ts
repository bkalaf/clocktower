// src/server/mappers/roomMapper.ts
import { idToString, omitUndefined, toIsoDate } from '@/server/db/dto';
import type { RoomDocument, RoomDTO, RoomStatus, RoomVisibility } from '@/types/room';

export function mapRoom(doc: RoomDocument): RoomDTO {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyDoc = doc;
    return omitUndefined({
        _id: idToString(anyDoc._id ?? anyDoc._id),
        hostUserId: idToString(anyDoc.hostUserId),
        status: (anyDoc.status ?? 'closed') as RoomStatus,
        scriptId: idToString(anyDoc.scriptId),
        allowTravelers: Boolean(anyDoc.allowTravelers),
        visibility: (anyDoc.visibility ?? 'public') as RoomVisibility,
        endedAt: toIsoDate(anyDoc.endedAt),
        maxPlayers: anyDoc.maxPlayers,
        minPlayers: anyDoc.minPlayers,
        maxTravelers: anyDoc.maxTravelers,
        edition: anyDoc.edition,
        skillLevel: anyDoc.skillLevel,
        plannedStartTime: toIsoDate(anyDoc.plannedStartTime)
    });
}
