// src/routes/_authed.rooms._room.$roomId.index.tsx
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { checkAuth } from '@/client/state/checkAuth';
import { fetchRoom } from '@/client/api/rooms';
import { GrimoirePage } from '@/components/grimoire/GrimoirePage';

export const Route = createFileRoute('/_authed/rooms/_room/$roomId/')({
    beforeLoad: () => {
        checkAuth();
    },
    loader: async ({ params }) => {
        return fetchRoom(params.roomId);
    },
    component: RouteComponent
});

function RouteComponent() {
    const params = Route.useParams();
    const data = Route.useLoaderData<typeof Route.loader>();
    const roomBanner = data.room.banner ?? '';
    const roomId = params.roomId;

    return (
        <div className='relative flex h-full flex-col'>
            <div className='absolute left-6 top-6 z-10 rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/70 shadow-lg'>
                {roomBanner || roomId}
            </div>
            <GrimoirePage roomId={roomId} />
            <Outlet />
        </div>
    );
}
