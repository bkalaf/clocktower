// src/components/townsquare/TownSquareInfo.tsx
import * as React from 'react';
import { Users, Heartbeat, VoteYea, UserPlus, ShieldCheck } from 'lucide-react';
import editions from '@/assets/data/editions.json';
import gameData from '@/assets/data/game.json';
import { useTownSquare } from '@/state/TownSquareContext';

export type TeamBreakdown = {
    townsfolk: number;
    outsider: number;
    minion: number;
    demon: number;
};

export function TownSquareInfo({ onOpenModal }: { onOpenModal: (modal: string) => void }) {
    const { players, session, grimoire } = useTownSquare();

    const nonTravelers = React.useMemo(
        () => players.filter((player) => player.role.team !== 'traveler').length,
        [players]
    );
    const alive = React.useMemo(() => players.filter((player) => !player.isDead).length, [players]);
    const thoughts = React.useMemo(() => {
        const entry = gameData[Math.max(0, Math.min(gameData.length - 1, nonTravelers - 5))] as TeamBreakdown;
        return entry;
    }, [nonTravelers]);

    const votes = React.useMemo(
        () => alive + players.filter((player) => player.isDead && !player.isVoteless).length,
        [alive, players]
    );

    const edition = editions[0];

    return (
        <div className='relative flex w-full flex-col gap-2 rounded-3xl border border-white/10 bg-black/60 p-4 text-[0.75rem] uppercase tracking-[0.3em] shadow-[0_25px_60px_rgba(0,0,0,0.7)] lg:w-72'>
            <div className='flex items-center justify-between text-xs text-slate-400'>
                <span>Edition</span>
                <button
                    type='button'
                    className='text-[0.65rem] uppercase tracking-[0.4em] text-sky-300 underline-offset-4'
                    onClick={() => onOpenModal('edition')}
                >
                    {edition.name}
                </button>
            </div>
            <div className='text-[1.2rem] font-cinzel uppercase tracking-[0.2em] text-white'>{edition.id}</div>
            <div className='grid gap-2 text-xs text-white/70'>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                        <Users className='h-4 w-4 text-emerald-300' />
                        Seats
                    </span>
                    <span>{players.length}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                        <VoteYea className='h-4 w-4 text-rose-500' />
                        Votes
                    </span>
                    <span>{votes}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                        <Heartbeat className='h-4 w-4 text-cyan-300' />
                        Alive
                    </span>
                    <span>{alive}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                        <UserPlus className='h-4 w-4 text-amber-300' />
                        Travelers
                    </span>
                    <span>{players.length - nonTravelers}</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                        <ShieldCheck className='h-4 w-4 text-indigo-300' />
                        Night
                    </span>
                    <span>{grimoire.isNight ? 'Active' : 'Day'}</span>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-2 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/70'>
                <span className='flex items-center justify-between border-t border-white/10 pt-2'>
                    Townsfolk
                    <strong>{thoughts.townsfolk}</strong>
                </span>
                <span className='flex items-center justify-between border-t border-white/10 pt-2'>
                    Outsider
                    <strong>{thoughts.outsider}</strong>
                </span>
                <span className='flex items-center justify-between border-t border-white/10 pt-2'>
                    Minion
                    <strong>{thoughts.minion}</strong>
                </span>
                <span className='flex items-center justify-between border-t border-white/10 pt-2'>
                    Demon
                    <strong>{thoughts.demon}</strong>
                </span>
            </div>
            <div className='flex items-center justify-between text-[0.6rem] uppercase tracking-[0.4em] text-slate-400'>
                <span>Night Order</span>
                <span>{grimoire.isNightOrder ? 'Shown' : 'Hidden'}</span>
            </div>
        </div>
    );
}
