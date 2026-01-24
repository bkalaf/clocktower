// src/server/rooms/helpers.ts
import { connectMongoose } from '../../db/connectMongoose';
import { GameModel } from '../../db/models/_Game';
import { GameMemberModel } from '../../db/models/GameMember';
import { InviteModel } from '../../db/models/Invite';

export async function loadRoom(roomId: string) {
    await connectMongoose();
    const room = await GameModel.findById(roomId).lean();
    return room;
}

export async function countPlayers(roomId: string) {
    await connectMongoose();
    return GameMemberModel.countDocuments({ gameId: roomId, role: 'player' });
}

export async function countPendingSeatInvites(roomId: string) {
    await connectMongoose();
    return InviteModel.countDocuments({
        roomId,
        kind: 'seat',
        status: 'pending',
        expiresAt: { $gt: new Date() }
    });
}

export async function availableSeats(roomId: string, maxPlayers: number) {
    const currentPlayers = await countPlayers(roomId);
    const pendingInvites = await countPendingSeatInvites(roomId);
    return Math.max(0, maxPlayers - currentPlayers - pendingInvites);
}
