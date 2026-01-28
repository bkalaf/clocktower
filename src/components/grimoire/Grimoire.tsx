// src/components/grimoire/Grimoire.tsx
import * as React from 'react';

import { Seat } from './Seat';
import {
    computeCircleSeatCenters,
    computeSeatTokenPositions,
    computeSquareSeatCenters,
    DEFAULT_GRIMOIRE_MARGIN,
    type LayoutMode,
    type Point
} from './computeLayout';
import type { ReminderDot } from './types';

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
    canvasWidth: number;
    canvasHeight: number;
    tableCenter?: Point;
    margin?: number;
};

const reminderPalette = ['#f97316', '#38bdf8', '#a855f7', '#facc15', '#f87171'];

export function Grimoire({ seats, layout, tokenSize, canvasWidth, canvasHeight, tableCenter, margin }: GrimoireProps) {
    const safeTokenSize = Math.max(75, Math.min(200, tokenSize));
    const avatarSize = Math.round(safeTokenSize / 0.8);
    const safeMargin = margin ?? DEFAULT_GRIMOIRE_MARGIN;
    const centerPoint = React.useMemo(
        () => ({
            x: canvasWidth / 2,
            y: canvasHeight / 2
        }),
        [canvasWidth, canvasHeight]
    );
    const resolvedTableCenter = tableCenter ?? centerPoint;
    const seatIds = React.useMemo(() => seats.map((seat) => seat.seatId), [seats]);

    const seatCenters = React.useMemo(() => {
        if (canvasWidth === 0 || canvasHeight === 0) {
            return [];
        }
        const options = {
            canvas: { width: canvasWidth, height: canvasHeight },
            count: seats.length,
            avatarSize,
            seatIds,
            margin: safeMargin
        };
        if (layout === 'square') {
            return computeSquareSeatCenters(options);
        }
        return computeCircleSeatCenters(options);
    }, [layout, canvasWidth, canvasHeight, seats.length, avatarSize, seatIds, safeMargin]);

    const centerMap = React.useMemo(() => {
        const map = new Map<string, Point>();
        seatCenters.forEach((seat) => map.set(seat.seatId, seat.center));
        return map;
    }, [seatCenters]);

    if (canvasWidth === 0 || canvasHeight === 0) {
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

                const positions = computeSeatTokenPositions({
                    seatCenter: { x: center.x, y: center.y },
                    tableCenter: resolvedTableCenter,
                    avatarSize,
                    tokenSize: safeTokenSize
                });

                const reminderTokens: ReminderDot[] = seat.reminders.map((label, index) => ({
                    label,
                    color: reminderPalette[index % reminderPalette.length]
                }));

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
                        reminderTokens={reminderTokens}
                    />
                );
            })}
        </div>
    );
}
