// src/components/header/BottomBar.tsx
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Clock, Moon, Sun, User, Users } from 'lucide-react';

import { usePreferences } from '@/hooks/usePreferences';
import { useRoomMatchState } from '@/state/useRoomMatchState';

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

const densitySpacing: Record<string, string> = {
    compact: 'gap-2 py-2',
    balanced: 'gap-3 py-2.5',
    airy: 'gap-4 py-3'
};

const toneStyles: Record<string, string> = {
    soft: 'border-t border-white/10 bg-slate-950/80',
    outline: 'border-t border-white/20 bg-slate-950/75',
    flat: 'border-t border-white/5 bg-slate-950/70'
};

const accentStyles: Record<string, string> = {
    ember: 'border border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-black text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    glacier:
        'border border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-black text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.3)]',
    violet: 'border border-violet-500/50 bg-gradient-to-br from-violet-500/10 to-black text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
};

export function BottomBar() {
    const { values } = usePreferences();
    const { roomState, matchState } = useRoomMatchState();
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
    const phase = matchState.phase ?? 'setup';
    const normalizedPhase =
        phase.toLowerCase().includes('night') ? 'Night'
        : phase.toLowerCase().includes('day') ? 'Day'
        : phase.charAt(0).toUpperCase() + phase.slice(1);
    const dayNumber = matchState.dayNumber ?? 1;
    const phaseIcon = normalizedPhase === 'Night' ? <Moon size={16} /> : <Sun size={16} />;

    const accentClass = accentStyles[values.accent] ?? accentStyles.ember;
    const toneClass = toneStyles[values.panelTone] ?? toneStyles.soft;
    const spacing = densitySpacing[values.density] ?? densitySpacing.compact;

    return (
        <footer className={`flex flex-wrap gap-3 px-4 ${toneClass} ${spacing} sm:px-6`}>
            <StatsWidget
                label='Current time'
                value={timeLabel}
                meta='Local'
                icon={<Clock size={16} />}
                accentClass={accentClass}
            />
            <StatsWidget
                label='Players'
                value={playerCount}
                meta='Connected / Seats'
                icon={<Users size={16} />}
                accentClass={accentClass}
            />
            <StatsWidget
                label='Role'
                value={role}
                meta='Assignment'
                icon={<User size={16} />}
                accentClass={accentClass}
            />
            <StatsWidget
                label='Phase'
                value={normalizedPhase}
                meta={`Day ${dayNumber}`}
                icon={phaseIcon}
                accentClass={accentClass}
            />
        </footer>
    );
}
