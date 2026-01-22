import { connectMongoose } from '@/db/connectMongoose';
import { RoomModel, type RoomSnapshotLean, type RoomSnapshotDoc } from '@/server/models/RoomModel';

export type RoomSnapshotUpsertArgs = RoomSnapshotDoc;

export async function upsertRoomSnapshot(args: RoomSnapshotUpsertArgs) {
    await connectMongoose();
    await RoomModel.updateOne({ _id: args._id }, { $set: args }, { upsert: true, setDefaultsOnInsert: true });
}

export async function getRoomDoc(roomId: string) {
    await connectMongoose();
    return RoomModel.findById(roomId).lean<RoomSnapshotLean>().exec();
}

export async function listRoomDocs() {
    await connectMongoose();
    return RoomModel.find().lean<RoomSnapshotLean>().exec();
}

export async function deleteRoomDoc(roomId: string) {
    await connectMongoose();
    await RoomModel.deleteOne({ _id: roomId }).exec();
}
