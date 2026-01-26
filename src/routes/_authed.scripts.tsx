import { createFileRoute } from '@tanstack/react-router'
// src/routes/_authed.scripts.tsx
export const Route = createFileRoute('/_authed/scripts')({
    beforeLoad: () => {
        checkAuth();
    },
    component: RouteComponent
});

function RouteComponent() {
    const rooms = useRealtimeRooms();
    const refresh = useRequestRoomsList();

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <div className='flex flex-col w-full self-start gap-6 overflow-auto'>
            <header>
                <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Rooms</p>
                <h1 className='text-2xl font-semibold text-white'>Available lobbies</h1>
            </header>
            <div className='flex items-center gap-3'>
                <button
                    type='button'
                    onClick={refresh}
                    className='rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white'
                >
                    Refresh
                </button>
                <span className='text-xs text-slate-400'>Server-sourced list</span>
            </div>
            <div className='overflow-auto rounded-2xl border border-white/10 bg-white/5 text-white'>
                <table className='w-full text-left'>
                    <thead className='border-b border-white/10 text-xs uppercase tracking-[0.3em] text-slate-400'>
                        <tr>
                            <th className='px-4 py-3'>Room ID</th>
                            <th className='px-4 py-3'>Banner</th>
                            <th className='px-4 py-3'>Players</th>
                            <th className='px-4 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length === 0 ?
                            <tr>
                                <td
                                    colSpan={4}
                                    className='px-4 py-6 text-center text-sm text-slate-400'
                                >
                                    No active rooms yet.
                                </td>
                            </tr>
                        :   rooms.map((room) => (
                                <tr
                                    key={room.roomId}
                                    className='border-b border-white/5 last:border-b-0'
                                >
                                    <td className='px-4 py-3 text-sm font-medium text-white'>{room.roomId}</td>
                                    <td className='px-4 py-3 text-sm text-slate-200'>{room.name ?? 'unlabeled'}</td>
                                    <td className='px-4 py-3 text-sm text-slate-200'>{room.playerCount}</td>
                                    <td className='px-4 py-3 text-sm text-slate-200'>{room.status ?? 'unknown'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}