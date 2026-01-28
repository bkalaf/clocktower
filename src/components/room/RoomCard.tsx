import * as React from 'react';
import { MessageCircle, Mail, DoorOpen, UserPlus } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type React from 'react';

type RoomCardProps = {
    room: RoomSummary;
    onMessageHost: (roomId: string) => void;
    onRequestInvite: (roomId: string) => void;
    onJoinRoom: (roomId: string) => void;
    onRequestTraveler: (roomId: string) => void;
};

type ActionButtonProps = {
    label: string;
    icon: React.ReactElement;
    onClick: () => void;
    enabled: boolean;
};

function ActionButton({ label, icon, onClick, enabled }: ActionButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type='button'
                    aria-label={label}
                    aria-disabled={!enabled}
                    onClick={enabled ? onClick : undefined}
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/70 text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                        enabled ? 'hover:border-white' : 'cursor-not-allowed opacity-40'
                    )}
                >
                    {React.cloneElement(icon, { className: 'h-4 w-4' })}
                </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>{label}</TooltipContent>
        </Tooltip>
    );
}

export function RoomCard({ room, onMessageHost, onRequestInvite, onJoinRoom, onRequestTraveler }: RoomCardProps) {
    const canJoin = room.visibility === 'public' && room.playerCount < room.maxPlayers;
    const allowInvites = room.visibility === 'private';
    const travelerSlotsOpen = room.allowTravellers && room.maxTravellers > 0;
    const plannedStart = room.plannedStartTime ? new Date(room.plannedStartTime) : null;
    const legibleStart =
        plannedStart ? plannedStart.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD';

    return (
        <article className='relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/90 to-slate-900/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.65)]'>
            <div className='flex items-start justify-between gap-4'>
                <div>
                    <p className='text-[10px] uppercase tracking-[0.4em] text-slate-400'>{room.visibility}</p>
                    <h3 className='mt-1 text-xl font-semibold text-white'>{room.banner || room.roomId}</h3>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-500'>
                        {room.scriptName ?? 'Script TBD'}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <ActionButton
                        label='Message host'
                        icon={<MessageCircle />}
                        onClick={() => onMessageHost(room.roomId)}
                        enabled={true}
                    />
                    <ActionButton
                        label='Request invite'
                        icon={<Mail />}
                        onClick={() => onRequestInvite(room.roomId)}
                        enabled={allowInvites}
                    />
                    <ActionButton
                        label='Join room'
                        icon={<DoorOpen />}
                        onClick={() => onJoinRoom(room.roomId)}
                        enabled={canJoin}
                    />
                    <ActionButton
                        label='Request to travel'
                        icon={<UserPlus />}
                        onClick={() => onRequestTraveler(room.roomId)}
                        enabled={travelerSlotsOpen}
                    />
                </div>
            </div>

            <div className='mt-6 grid grid-cols-2 gap-3 text-sm text-slate-300'>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-white/60'>Host</p>
                    <p className='text-base text-white'>{room.hostUsername ?? 'Unknown'}</p>
                </div>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-white/60'>Players</p>
                    <p className='text-base text-white'>
                        {room.playerCount}/{room.maxPlayers} players
                    </p>
                </div>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-white/60'>Start</p>
                    <p className='text-base text-white'>{legibleStart}</p>
                </div>
                <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-white/60'>Skill</p>
                    <p className='text-base text-white'>{room.skillLevel}</p>
                </div>
            </div>

            <div className='mt-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-400'>
                <span className='rounded-full border border-white/10 px-3 py-1 text-white/80'>
                    Status · {room.status ?? 'unknown'}
                </span>
                <span className='rounded-full border border-white/10 px-3 py-1 text-white/80'>
                    Speed · {room.speed}
                </span>
                <span className='flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-white/80'>
                    <span className='h-2 w-2 rounded-full bg-emerald-400' />
                    {room.allowTravellers ? `Travelers · ${room.maxTravellers}` : 'Travelers · disabled'}
                </span>
            </div>

            <div className='mt-5 text-xs text-slate-400'>
                <p>Connected {Object.keys(room.connectedUserIds).length} active users</p>
            </div>

            <div className='pointer-events-none absolute inset-0 rounded-[32px] border border-white/5' />

            <div className='absolute bottom-3 right-3 z-10'>
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type='button'
                            className='flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/60'
                        >
                            BOTC
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className='bg-slate-950 text-white border border-white/20 p-3 shadow-lg'>
                        <p className='text-xs font-bold uppercase tracking-[0.2em] underline'>
                            Blood on the Clocktower
                        </p>
                        <p className='mt-2 text-[11px] text-white/80'>
                            Blood on the Clocktower is a registered trademark of The Pandemonium Institute.
                        </p>
                        <p className='mt-1 text-[11px] text-white/80'>They are in no way affiliated with Eidolon.</p>
                        <p className='mt-1 text-[11px] text-white/80'>
                            Eidolon does not claim ownership of that trademark.
                        </p>
                    </PopoverContent>
                </Popover>
            </div>
        </article>
    );
}
