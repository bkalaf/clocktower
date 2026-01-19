// src/server/mappers/roomMapper.ts
import { idToString, omitUndefined, toIsoDate } from '@/server/db/dto';
import type { RoomDocument } from '@/db/models/Room';
import type { RoomDTO, RoomStatus, RoomVisibility } from '@/types/room';

export function mapRoom(doc: RoomDocument): RoomDTO {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyDoc = doc as any;
    return omitUndefined({
        id: idToString(anyDoc._id ?? anyDoc.id),
        hostUserId: idToString(anyDoc.hostUserId),
        status: (anyDoc.status ?? 'closed') as RoomStatus,
        scriptId: idToString(anyDoc.scriptId),
        allowTravelers: Boolean(anyDoc.allowTravelers),
        visibility: (anyDoc.visibility ?? 'public') as RoomVisibility,
        endedAt: toIsoDate(anyDoc.endedAt),
        lobbySettings: anyDoc.lobbySettings ?? null,
        createdAt: toIsoDate(anyDoc.createdAt),
        updatedAt: toIsoDate(anyDoc.updatedAt)
    });
}
