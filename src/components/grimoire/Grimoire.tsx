// src/components/grimoire/Grimoire.tsx
import * as React from 'react';
import { Seat, type ReminderDot } from './Seat';
import {
    computeCircleSeatCenters,
    computeSeatTokenPositions,
    computeSquareSeatCenters,
    type LayoutMode,
    type SeatCenter
} from './computeLayout';

export type GrimoireSeat = {
    seatId: string;
    playerName: string;
    avatarUrl: string;
    roleName: string;
    roleImage?: string;
    reminders: string[];
};

export type GrimoireProps = {
    seats: GrimoireSeat[];
    layout: LayoutMode;
    tokenSize: number;
    viewport: {
        width: number;
        height: number;
    };
    tableCenter: {
        x: number;
        y: number;
    };
    margin?: number;
};

const reminderPalette = ['#f97316', '#38bdf8', '#a855f7', '#facc15', '#f87171'];

export function Grimoire({ seats, layout, tokenSize, viewport, tableCenter, margin }: GrimoireProps) {
    const safeTokenSize = Math.max(75, Math.min(200, tokenSize));
    const avatarSize = Math.max(64, Math.round(safeTokenSize / 0.8));
    const seatIds = React.useMemo(() => seats.map((seat) => seat.seatId), [seats]);

    const baseOptions = React.useMemo(
        () => ({
            viewport,
            count: seats.length,
            avatarSize,
            tokenSize: safeTokenSize,
            seatIds,
            margin
        }),
        [viewport, seats.length, avatarSize, safeTokenSize, seatIds, margin]
    );

    const seatCenters = React.useMemo(() => {
        if (layout === 'square') {
            return computeSquareSeatCenters(baseOptions);
        }
        return computeCircleSeatCenters(baseOptions);
    }, [layout, baseOptions]);

    const centerMap = React.useMemo(() => {
        const map = new Map<string, SeatCenter>();
        seatCenters.forEach((seat) => map.set(seat.seatId, seat));
        return map;
    }, [seatCenters]);

    if (viewport.width === 0 || viewport.height === 0) {
        return (
            <div className='flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-white/60'>
                Measuring space…
            </div>
        );
    }

    return (
        <div className='relative h-full w-full'>
            {seats.map((seat) => {
                const center = centerMap.get(seat.seatId);
                if (!center) return null;

                const remindersMeta: ReminderDot[] = seat.reminders.slice(0, 3).map((label, index) => ({
                    label,
                    color: reminderPalette[index % reminderPalette.length]
                }));

                const positions = computeSeatTokenPositions({
                    seatCenter: center.center,
                    tableCenter,
                    avatarSize,
                    tokenSize: safeTokenSize,
                    reminderCount: remindersMeta.length
                });

                return (
                    <Seat
                        key={seat.seatId}
                        seatId={seat.seatId}
                        playerName={seat.playerName}
                        avatarUrl={seat.avatarUrl}
                        roleName={seat.roleName}
                        roleImage={seat.roleImage}
                        avatarSize={avatarSize}
                        tokenSize={safeTokenSize}
                        positions={positions}
                        reminderTokens={remindersMeta}
                    />
                );
            })}
        </div>
    );
}
