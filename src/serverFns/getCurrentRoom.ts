// src/serverFns/getCurrentRoom.ts
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';

import { connectMongoose } from '@/db/connectMongoose';
import { RoomModel } from '@/server/models/RoomModel';

const getCurrentRoomInput = z.object({
    userId: z.string().min(1).nullable().optional()
});

export const getCurrentRoom = createServerFn({
    method: 'GET'
})
    .inputValidator(getCurrentRoomInput)
    .handler(async ({ data: { userId } }) => {
        if (!userId) {
            return null;
        }
        
        await connectMongoose();
        const query = {
            $or: [
                { hostUserId: userId },
                { [`connectedUserIds.${userId}`]: { $exists: true } },
                { connectedUserIds: userId }
            ]
        } as const;
        const room = await RoomModel.findOne(query).lean();
        return room?._id ?? null;
    });

export type GetCurrentRoomInput = z.infer<typeof getCurrentRoomInput>;
