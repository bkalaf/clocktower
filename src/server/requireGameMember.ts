// src/server/requireGameMember.ts
import { connectMongoose } from '../db/connectMongoose';
import { GameMemberModel } from '../db/models/gameMember';
import { HttpError } from '../errors';
import { AuthedUser } from '../types/game';

export async function requireGameMember(gameId: string, user: AuthedUser) {
    await connectMongoose();
    const member = await GameMemberModel.findOne({ gameId, userId: user._id }).lean();
    if (!member) {
        throw HttpError.FORBIDDEN('FORBIDDEN: Not in game.');
    }
    return { role: member.role, userId: member.userId };
}
