// src/components/grimoire/Seat.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { SeatTokenPositions } from './computeLayout';

export type ReminderDot = {
    label: string;
    color?: string;
};

export type SeatProps = {
    seatId: string;
    playerName: string;
    avatarUrl: string;
    roleName: string;
    roleImage?: string;
    avatarSize: number;
    tokenSize: number;
    positions: SeatTokenPositions;
    reminderTokens: ReminderDot[];
};

export function Seat({
    playerName,
    avatarUrl,
    roleImage,
    roleName,
    avatarSize,
    tokenSize,
    positions,
    reminderTokens
}: SeatProps) {
    const avatarLeft = positions.avatar.x - avatarSize / 2;
    const avatarTop = positions.avatar.y - avatarSize / 2;
    const reminderDiameter = tokenSize / 2;

    return (
        <div className='pointer-events-none'>
            <div
                className='absolute rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
                style={{
                    width: avatarSize,
                    height: avatarSize,
                    left: avatarLeft,
                    top: avatarTop,
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.05), rgba(15,23,42,0.85)), url(${avatarUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            <div
                className='pointer-events-none absolute rounded-full border-4 border-white/20 bg-slate-900/70 shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition duration-200'
                style={{
                    width: tokenSize,
                    height: tokenSize,
                    left: positions.role.x - tokenSize / 2,
                    top: positions.role.y - tokenSize / 2,
                    backgroundImage:
                        roleImage ?
                            `linear-gradient(180deg, rgba(255,255,255,0.15), rgba(15,23,42,0.8)), url(${roleImage})`
                        :   undefined,
                    backgroundSize: '75%',
                    backgroundPosition: 'center'
                }}
            >
                <span
                    className={cn(
                        'absolute inset-0 flex items-center justify-center text-[0.6rem] uppercase tracking-[0.4em] text-white'
                    )}
                >
                    {roleName}
                </span>
            </div>

            {reminderTokens.map((reminder, index) => {
                const reminderPosition = positions.reminders[index];
                if (!reminderPosition) return null;
                return (
                    <div
                        key={`${playerName}-${reminder.label}-${index}`}
                        className='absolute flex items-center justify-center rounded-full border border-white/30 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                        style={{
                            width: reminderDiameter,
                            height: reminderDiameter,
                            left: reminderPosition.x - reminderDiameter / 2,
                            top: reminderPosition.y - reminderDiameter / 2,
                            backgroundColor: reminder.color ?? 'rgba(59,130,246,0.8)'
                        }}
                    >
                        {reminder.label.charAt(0)}
                    </div>
                );
            })}

            <div
                className='absolute text-center text-[0.65rem] uppercase tracking-[0.35em] text-white/70'
                style={{
                    width: avatarSize,
                    left: avatarLeft,
                    top: avatarTop + avatarSize + 6
                }}
            >
                {playerName}
            </div>
        </div>
    );
}
