import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Check, Clock3, Robot, Users, Users2, UserCheck, UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRequestRoomsList, useAppSelector } from '@/client/state/hooks';
import { useRealtimeRooms } from '@/client/state/useRealtimeRooms';
import { checkAuth } from '@/client/state/checkAuth';
import { themeSelectors } from '@/client/state/themeSlice';

const PAGE_SIZE = 8;

type RoomStatus = 'open' | 'in_progress' | 'closed' | 'reveal' | 'unknown';

type RoomHost = {
    username: string;
    avatarUrl: string;
    level: number;
    backgroundColor: string;
};

type NormalizedRoom = {
    id: string;
    bannerName: string;
    status: RoomStatus;
    acceptingNewPlayers: boolean;
    acceptingTravelers: boolean;
    maxPlayers: number;
    currentPlayers: number;
    travelersConsumed: number;
    plannedStartTime: string;
    allowAIPlayers: boolean;
    connectedUsers: number;
    replayAvailableAfterMatch: boolean;
    host: RoomHost;
};

const STATUS_LABELS: Record<RoomStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    closed: 'Closed',
    reveal: 'Reveal',
    unknown: 'Unknown'
};

function mapRoomStatus(status?: string): RoomStatus {
    switch (status) {
        case 'open':
        case 'in_progress':
        case 'closed':
        case 'reveal':
            return status;
        case 'in_game':
            return 'in_progress';
        default:
            return 'unknown';
    }
}

function normalizeRoom(room: RoomSummary): NormalizedRoom {
    const safeStatus = mapRoomStatus(room.status);
    const safeMaxPlayers = typeof room.maxPlayers === 'number' ? room.maxPlayers : 0;
    const safeCurrentPlayers = typeof room.playerCount === 'number' ? room.playerCount : 0;
    const connectedUsers = Object.keys(room.connectedUserIds ?? {}).length;
    const hostLevel = 0; // TODO: derive from snapshot/rim selectors once metadata is available.
    const hostBackgroundColor = '#334155'; // TODO: allow player preference to override.
    const avatarUrl = ''; // TODO: read host avatar URL from snapshot/rim selectors when ready.
    const acceptingPlayers = safeStatus === 'open'; // TODO: replace with derived selectors (snapshot/rim).
    const acceptingTravelers = Boolean(room.allowTravellers); // TODO: replace with snapshot-derived flags.

    return {
        id: room.roomId,
        bannerName: room.banner ?? room.name ?? '<<unknown>>',
        status: safeStatus,
        acceptingNewPlayers: acceptingPlayers,
        acceptingTravelers,
        maxPlayers: safeMaxPlayers,
        currentPlayers: safeCurrentPlayers,
        travelersConsumed: 0, // TODO: wire travel snapshot data.
        plannedStartTime: room.plannedStartTime ?? '<<unknown>>',
        allowAIPlayers: false, // TODO: fill once AI settings are exposed.
        connectedUsers,
        replayAvailableAfterMatch: false, // TODO: derive from rim.
        host: {
            username: room.hostUsername ?? '<<unknown>>',
            avatarUrl,
            level: hostLevel,
            backgroundColor: hostBackgroundColor
        }
    };
}

function getRingColorClass(room: NormalizedRoom) {
    if (room.status === 'closed' || room.status === 'reveal') {
        return 'ring-cyan-400/80 shadow-[0_0_30px_rgba(45,212,255,0.35)]';
    }
    if (room.status === 'in_progress') {
        return 'ring-yellow-400/80 shadow-[0_0_30px_rgba(251,191,36,0.35)]';
    }
    if (room.maxPlayers > 0 && room.currentPlayers >= room.maxPlayers) {
        return 'ring-yellow-400/70 shadow-[0_0_20px_rgba(251,191,36,0.25)]';
    }
    if (room.status === 'open' && room.acceptingNewPlayers) {
        return 'ring-lime-400/80 shadow-[0_0_30px_rgba(132,204,22,0.35)]';
    }
    return 'ring-slate-600/80 shadow-[0_0_15px_rgba(15,23,42,0.8)]';
}

const RoomRouteHeader = ({ density }: { density: string }) => (
    <header className='flex flex-col gap-2'>
        <p className='text-[11px] uppercase tracking-[0.4em] text-slate-400'>Rooms</p>
        <div className='flex items-center justify-between gap-3'>
            <h1 className='text-3xl font-semibold'>Available lobbies</h1>
            <span className='text-[10px] uppercase tracking-[0.4em] text-slate-400'>
                Density · {density}
            </span>
        </div>
        <p className='text-xs text-slate-400'>Live updates powered by the realtime socket.</p>
    </header>
);

type LobbyRoomCardProps = {
    room: NormalizedRoom;
    onRoomClick?: (roomId: string) => void;
};

function LobbyRoomCard({ room, onRoomClick }: LobbyRoomCardProps) {
    const ringClass = getRingColorClass(room);
    const badgeColor = room.host.backgroundColor ?? '#334155';
    const statusLabel = STATUS_LABELS[room.status] ?? STATUS_LABELS.unknown;
    const handleClick = React.useCallback(() => onRoomClick?.(room.id), [onRoomClick, room.id]);

    const cardStyle = room.host.avatarUrl
        ? {
              backgroundImage: `url(${room.host.avatarUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
          }
        : undefined;

    const booleanIcon = (value: boolean) =>
        value ? (
            <Check className='h-4 w-4 text-emerald-400' />
        ) : (
            <X className='h-4 w-4 text-rose-400' />
        );

    return (
        <button
            type='button'
            aria-label={`${room.bannerName} hosted by ${room.host.username}`}
            onClick={handleClick}
            className={cn(
                'relative flex min-h-[320px] w-full flex-col overflow-hidden rounded-[32px] ring-4 ring-offset-4 ring-offset-slate-950/60 bg-slate-950/60 text-left shadow-[0_25px_80px_rgba(0,0,0,0.65)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
                ringClass
            )}
            style={{
                ...cardStyle,
                backgroundColor: cardStyle ? undefined : '#0c1221'
            }}
        >
            <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-slate-900/80 to-slate-900/90' />
            <div className='relative z-10 flex h-full flex-col justify-between gap-4 p-5'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='max-w-[70%]'>
                        <h3 className='text-lg font-semibold leading-tight text-white'>{room.bannerName}</h3>
                        <p className='text-[11px] uppercase tracking-[0.3em] text-white/70'>
                            Hosted by {room.host.username}
                        </p>
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                        <span className='rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90'>
                            {statusLabel}
                        </span>
                        <span
                            className='rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white'
                            style={{ backgroundColor: badgeColor }}
                        >
                            {room.host.level}
                        </span>
                    </div>
                </div>

                <div className='rounded-xl border border-white/20 bg-white/5 p-4'>
                    <div className='flex flex-col gap-3 text-sm text-white/80'>
                        <DetailRow
                            icon={<Users2 className='h-4 w-4 text-white/70' />}
                            label='Players'
                            value={`${room.currentPlayers}/${room.maxPlayers}`}
                        />
                        <DetailRow
                            icon={<Users className='h-4 w-4 text-white/70' />}
                            label='Connected users'
                            value={room.connectedUsers}
                        />
                        <DetailRow
                            icon={<Users2 className='h-4 w-4 text-white/70' />}
                            label='Travelers used'
                            value={room.travelersConsumed}
                        />
                        <DetailRow
                            icon={<Clock3 className='h-4 w-4 text-white/70' />}
                            label='Planned start time'
                            value={room.plannedStartTime}
                        />
                        <DetailRow icon={<UserCheck className='h-4 w-4 text-white/70' />} label='Accepting players' value={booleanIcon(room.acceptingNewPlayers)} />
                        <DetailRow icon={<UserPlus className='h-4 w-4 text-white/70' />} label='Accepting travelers' value={booleanIcon(room.acceptingTravelers)} />
                        <DetailRow icon={<Robot className='h-4 w-4 text-white/70' />} label='Allow AI players' value={booleanIcon(room.allowAIPlayers)} />
                        <DetailRow icon={<Clock3 className='h-4 w-4 text-white/70' />} label='Replay available after match' value={booleanIcon(room.replayAvailableAfterMatch)} />
                    </div>
                </div>
            </div>
        </button>
    );
}

type DetailRowProps = {
    icon: React.ReactElement;
    label: string;
    value: React.ReactNode;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
    return (
        <div className='flex items-center justify-between gap-3 text-white/85'>
            <div className='flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70'>
                {icon}
                <span>{label}</span>
            </div>
            <div className='text-sm font-semibold text-white'>{value}</div>
        </div>
    );
}

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
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        refresh();
    }, [refresh]);

    const normalizedRooms = React.useMemo(() => rooms.map(normalizeRoom), [rooms]);
    const totalPages = Math.max(1, Math.ceil(normalizedRooms.length / PAGE_SIZE));
    const safePage = Math.min(totalPages, Math.max(1, page));

    React.useEffect(() => {
        if (safePage !== page) {
            setPage(safePage);
        }
    }, [page, safePage]);

    const pagedRooms = React.useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return normalizedRooms.slice(start, start + PAGE_SIZE);
    }, [normalizedRooms, safePage]);

    const handlePrevPage = React.useCallback(() => {
        setPage((current) => Math.max(1, current - 1));
    }, []);

    const handleNextPage = React.useCallback(() => {
        setPage((current) => Math.min(totalPages, current + 1));
    }, [totalPages]);

    const handleRoomClick = React.useCallback((roomId: string) => {
        void console.log('Room clicked', roomId);
    }, []);

    return (
        <div className='flex flex-col gap-6 px-4 py-6 text-white'>
            <RoomRouteHeader density={density} />

            <div
                className={cn(
                    'rounded-3xl border border-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)]',
                    backgroundClass,
                    'bg-opacity-80'
                )}
            >
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                        <div>
                            <p className='text-xs uppercase tracking-[0.4em] text-slate-400'>Active rooms</p>
                            <p className='text-2xl font-semibold'>{normalizedRooms.length}</p>
                        </div>
                        <div className='flex flex-wrap items-center gap-2'>
                            <Button variant='outline' size='sm' onClick={refresh}>
                                Refresh
                            </Button>
                            <Button variant='ghost' size='sm' onClick={handlePrevPage} disabled={safePage <= 1}>
                                Prev
                            </Button>
                            <span className='text-sm font-semibold text-white'>
                                Page {safePage} / {totalPages}
                            </span>
                            <Button variant='ghost' size='sm' onClick={handleNextPage} disabled={safePage >= totalPages}>
                                Next
                            </Button>
                        </div>
                    </div>

                    {normalizedRooms.length === 0 ? (
                        <div className='flex min-h-[220px] items-center justify-center text-sm text-slate-300'>
                            No active rooms yet.
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
                            {pagedRooms.map((room) => (
                                <LobbyRoomCard key={room.id} room={room} onRoomClick={handleRoomClick} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
