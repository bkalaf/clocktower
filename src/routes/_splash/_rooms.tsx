// src/routes/_splash/_rooms.tsx
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { getCurrentRoom } from '@/serverFns/getCurrentRoom';

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
