// src/routes/_splash/_rooms.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod';
import { RoomModel } from '../../server/models/RoomModel';

const getCurrentRoomInput = z.object({
    userId: z.string().min(1, 'Must be a uuid').nullable().optional()
});
export const getCurrentRoom = createServerFn({
    method: 'GET'
})
    .inputValidator(getCurrentRoomInput)
    .handler(async ({ data: { userId } }) => {
        const result = await RoomModel.find({ $or: [{ hostUserId: userId }, { connectedUserIds: userId }] }).exec();
        if (result.length === 0) {
            return null;
        }
        return result[0]._id;
    });

export const Route = createFileRoute('/_splash/_rooms')({
    loader: async ({ context }) => {
        if (context.userId == null) return;
        const roomId = await getCurrentRoom({ data: { userId: context.userId } });
        return {
            roomId
        };
    },
    component: RouteComponent
});

function RouteComponent() {
    return <Outlet />;
}
