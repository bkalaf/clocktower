// src/components/header/BottomBar.tsx
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Clock, Moon, Sun, User, Users } from 'lucide-react';

import { useRoomGameState } from '@/state/useRoomGameState';
import { ClientOnly } from '@tanstack/react-router';

type StatsWidgetProps = {
    label: string;
    value: string;
    meta: string;
    icon: ReactNode;
    accentClass?: string;
};

function StatsWidget({ label, value, meta, icon, accentClass = '' }: StatsWidgetProps) {
    return (
        <div
            className={`flex min-w-[150px] flex-1 flex-col gap-1 rounded-2xl px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${accentClass}`}
        >
            <div className='flex items-center gap-2'>
                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white'>
                    {icon}
                </span>
                <span className='text-[9px] font-semibold tracking-[0.35em] text-slate-400'>{label}</span>
            </div>
            <span className='text-sm font-semibold text-white'>{value}</span>
            <span className='text-[9px] font-semibold tracking-[0.35em] text-slate-500'>{meta}</span>
        </div>
    );
}

export function BottomBar() {
    const { roomState, gameState } = useRoomGameState();
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const timeLabel = useMemo(
        () =>
            now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }),
        [now]
    );

    const connectedCount = roomState.connectedUserIds.length;
    const maxPlayers = roomState.maxPlayers ?? 0;
    const playerCount = `${connectedCount}/${maxPlayers || '—'}`;
    const role = roomState.memberRole ?? 'spectator';
    const phase = gameState.phase ?? 'setup';
    const normalizedPhase =
        phase.toLowerCase().includes('night') ? 'Night'
        : phase.toLowerCase().includes('day') ? 'Day'
        : phase.charAt(0).toUpperCase() + phase.slice(1);
    const dayNumber = gameState.dayNumber ?? 1;
    const phaseIcon = normalizedPhase === 'Night' ? <Moon size={16} /> : <Sun size={16} />;

    // const accentClass =  accentStyles[values.accent] ?? accentStyles.ember;
    // const toneClass =  toneStyles[values.panelTone] ?? toneStyles.soft;
    // const spacing =  densitySpacing[values.density] ?? densitySpacing.compact;
    const toneClass = '';
    const spacing = '';
    return (
        <footer className={`flex flex-wrap gap-3 px-4 ${toneClass ?? ''} ${spacing} sm:px-6`}>
            <ClientOnly>
                <StatsWidget
                    label='Current time'
                    value={timeLabel}
                    meta='Local'
                    icon={<Clock size={16} />}
                    // accentClass={accentClass}
                />
            </ClientOnly>
            <StatsWidget
                label='Players'
                value={playerCount}
                meta='Connected / Seats'
                icon={<Users size={16} />}
                // accentClass={accentClass}
            />
            <StatsWidget
                label='Role'
                value={role}
                meta='Assignment'
                icon={<User size={16} />}
                // accentClass={accentClass}
            />
            <StatsWidget
                label='Phase'
                value={normalizedPhase}
                meta={`Day ${dayNumber}`}
                icon={phaseIcon}
                // accentClass={accentClass}
            />
        </footer>
    );
}
