// src/server/persistence/roomPersistence.ts
import { RoomModel, RoomSnapshotDocument } from '../models/RoomModel';

// What we persist for a room snapshot (flattened doc)

export async function upsertRoomSnapshot(args: UpsertRoomArgs) {
    // NOTE: RoomDoc uses Map for readyByUserId; mongoose accepts object assignment.
    const update: Partial<RoomSnapshotDocument> = {
        _id: args._id,

        allowTravellers: args.allowTravellers,
        banner: args.banner,
        connectedUserIds: args.connectedUserIds as ConnectedUsers,
        endedAt: args.endedAt,
        hostUserId: args.hostUserId,
        maxPlayers: args.maxPlayers as PcPlayerCount,
        minPlayers: args.minPlayers as PcPlayerCount,
        maxTravellers: args.maxTravellers as PcTravellerCount,
        plannedStartTime: args.plannedStartTime,
        scriptId: args.scriptId,
        skillLevel: args.skillLevel as SkillLevel,
        speed: args.speed as GameSpeed,
        visibility: args.visibility as RoomVisibility,

        acceptingPlayers: args.acceptingPlayers,
        currentMatchId: args.currentMatchId,
        readyByUserId: args.readyByUserId as ReadyByUserRecord,
        storytellerMode: args.storytellerMode as StorytellerMode,

        stateValue: args.stateValue,
        persistedSnapshot: args.persistedSnapshot
    };

    await RoomModel.updateOne({ _id: args._id }, { $set: update }, { upsert: true }).exec();
}

// Read helpers (server-only; UI doesn't call these)
export async function getRoomDoc(roomId: string) {
    return RoomModel.findById(roomId).lean().exec();
}

export async function listRoomDocs(
    filter: Partial<Pick<RoomSnapshotDocument, '_id' | 'hostUserId' | 'visibility'>> = {}
) {
    return RoomModel.find(filter).lean().exec();
}

export async function deleteRoomDoc(roomId: string) {
    return RoomModel.deleteOne({ _id: roomId }).exec();
}
