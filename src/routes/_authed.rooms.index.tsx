import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { composeCn } from '@/lib/composeCn';
import { cn } from '@/lib/utils';
import { checkAuth } from '@/client/state/checkAuth';
import { useRequestRoomsList, useAppSelector } from '@/client/state/hooks';
import { useRealtimeRooms } from '@/client/state/useRealtimeRooms';
import { RoomCard } from '@/components/room/RoomCard';
import { themeSelectors } from '@/client/state/themeSlice';

export const Route = createFileRoute('/_authed/rooms')({
    beforeLoad: () => {
        checkAuth();
    },
    component: RoomsRoute
});

function RoomsRoute() {
    const rooms = useRealtimeRooms();
    const refresh = useRequestRoomsList();
    const backgroundClass = useAppSelector(themeSelectors.selectBackgroundColorClass);
    const density = useAppSelector(themeSelectors.selectDensity);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const handleMessageHost = React.useCallback((roomId: string) => {
        void console.log('Message host clicked for', roomId);
    }, []);

    const handleRequestInvite = React.useCallback((roomId: string) => {
        void console.log('Request invite clicked for', roomId);
    }, []);

    const handleJoinRoom = React.useCallback((roomId: string) => {
        void console.log('Join room clicked for', roomId);
    }, []);

    const handleRequestTraveler = React.useCallback((roomId: string) => {
        void console.log('Request traveler clicked for', roomId);
    }, []);

    return (
        <div className='flex flex-col gap-6 px-4 py-6 text-white'>
            <header className='flex flex-col gap-2'>
                <p className='text-[11px] uppercase tracking-[0.4em] text-slate-400'>Rooms</p>
                <div className='flex items-center justify-between gap-3'>
                    <h1 className='text-3xl font-semibold'>Available lobbies</h1>
                    <div className='flex items-center gap-3'>
                        <span className='text-[10px] uppercase tracking-[0.4em] text-slate-400'>
                            Density · {density}
                        </span>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={refresh}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>
                <p className='text-xs text-slate-400'>Live updates powered by the realtime socket.</p>
            </header>

            <div
                className={cn(
                    'rounded-3xl border border-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)]',
                    backgroundClass,
                    'bg-opacity-80'
                )}
            >
                {rooms.length === 0 ?
                    <div className='flex min-h-[220px] items-center justify-center text-sm text-slate-300'>
                        No active rooms yet.
                    </div>
                :   <div className={composeCn('grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3')}>
                        {rooms.map((room) => (
                            <RoomCard
                                key={room.roomId}
                                room={room}
                                onMessageHost={handleMessageHost}
                                onRequestInvite={handleRequestInvite}
                                onJoinRoom={handleJoinRoom}
                                onRequestTraveler={handleRequestTraveler}
                            />
                        ))}
                    </div>
                }
            </div>
        </div>
    );
}
