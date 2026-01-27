// src/components/grimoire/computeLayout.ts
export type LayoutMode = 'circle' | 'square';

type Point = {
    x: number;
    y: number;
};

type Viewport = {
    width: number;
    height: number;
};

type LayoutBaseOptions = {
    viewport: Viewport;
    count: number;
    avatarSize: number;
    tokenSize: number;
    seatIds?: string[];
    margin?: number;
};

export type SeatCenter = {
    seatId: string;
    angleRad: number;
    center: Point;
};

export type SeatTokenPositions = {
    avatar: Point;
    role: Point;
    reminders: Point[];
};

const safeMargin = (value?: number) => Math.max(0, value ?? 32);

const computeAngleFromCenter = (center: Point, tableCenter: Point) => {
    const dx = center.x - tableCenter.x;
    const dy = tableCenter.y - center.y;
    return Math.atan2(dx, dy);
};

const normalize = (vector: Point): Point => {
    const length = Math.hypot(vector.x, vector.y);
    if (length === 0) {
        return { x: 0, y: -1 };
    }
    return { x: vector.x / length, y: vector.y / length };
};

const seatOuterExtent = (avatarSize: number) => avatarSize / 2 + 12;

export function computeCircleSeatCenters(options: LayoutBaseOptions): SeatCenter[] {
    const { viewport, count, avatarSize, seatIds = [], margin, tokenSize } = options;
    if (count <= 0 || viewport.width === 0 || viewport.height === 0) {
        return [];
    }

    const safeViewportWidth = Math.max(0, viewport.width);
    const safeViewportHeight = Math.max(0, viewport.height);
    const centerPoint: Point = { x: safeViewportWidth / 2, y: safeViewportHeight / 2 };
    const radius = Math.max(
        0,
        Math.min(safeViewportWidth, safeViewportHeight) * 0.5 - safeMargin(margin) - seatOuterExtent(avatarSize)
    );

    return Array.from({ length: count }, (_, index) => {
        const angle = (Math.PI * 2 * index) / count;
        const x = centerPoint.x + radius * Math.sin(angle);
        const y = centerPoint.y - radius * Math.cos(angle);
        const seatCenter = { x, y };
        const tableCenter = centerPoint;
        return {
            seatId: seatIds[index] ?? `seat-${index}`,
            angleRad: computeAngleFromCenter(seatCenter, tableCenter),
            center: seatCenter
        };
    });
}

export function computeSquareSeatCenters(options: LayoutBaseOptions): SeatCenter[] {
    const { viewport, count, avatarSize, seatIds = [], margin } = options;
    if (count <= 0 || viewport.width === 0 || viewport.height === 0) {
        return [];
    }

    const safeMarginValue = safeMargin(margin);
    const seatPadding = seatOuterExtent(avatarSize);
    const left = safeMarginValue + seatPadding;
    const right = Math.max(left, viewport.width - (safeMarginValue + seatPadding));
    const top = safeMarginValue + seatPadding;
    const bottom = Math.max(top, viewport.height - (safeMarginValue + seatPadding));

    const horizontalRange = Math.max(0, right - left);
    const verticalRange = Math.max(0, bottom - top);
    const perimeter = (horizontalRange + verticalRange) * 2;
    if (perimeter === 0) {
        const fallbackCenter: Point = { x: viewport.width / 2, y: viewport.height / 2 };
        return Array.from({ length: count }, (_, index) => ({
            seatId: seatIds[index] ?? `seat-${index}`,
            angleRad: computeAngleFromCenter(fallbackCenter, fallbackCenter),
            center: fallbackCenter
        }));
    }

    const tableCenter: Point = { x: viewport.width / 2, y: viewport.height / 2 };

    return Array.from({ length: count }, (_, index) => {
        const progress = (perimeter * index) / count;
        let x = left;
        let y = top;
        const lengths = [horizontalRange, verticalRange, horizontalRange, verticalRange];
        let remaining = progress;

        if (remaining <= lengths[0]) {
            x = left + remaining;
            y = top;
        } else if (remaining <= lengths[0] + lengths[1]) {
            remaining -= lengths[0];
            x = right;
            y = top + remaining;
        } else if (remaining <= lengths[0] + lengths[1] + lengths[2]) {
            remaining -= lengths[0] + lengths[1];
            x = right - remaining;
            y = bottom;
        } else {
            remaining -= lengths[0] + lengths[1] + lengths[2];
            x = left;
            y = bottom - remaining;
        }

        const seatCenter: Point = { x, y };
        return {
            seatId: seatIds[index] ?? `seat-${index}`,
            angleRad: computeAngleFromCenter(seatCenter, tableCenter),
            center: seatCenter
        };
    });
}

export function computeSeatTokenPositions(args: {
    seatCenter: Point;
    tableCenter: Point;
    avatarSize: number;
    tokenSize: number;
    reminderCount: number;
    reminderGap?: number;
}): SeatTokenPositions {
    const { seatCenter, tableCenter, avatarSize, tokenSize, reminderCount, reminderGap } = args;
    const toCenter = normalize({
        x: tableCenter.x - seatCenter.x,
        y: tableCenter.y - seatCenter.y
    });

    const roleRadius = avatarSize / 2 + tokenSize * 0.1;
    const roleCenter: Point = {
        x: seatCenter.x + toCenter.x * roleRadius,
        y: seatCenter.y + toCenter.y * roleRadius
    };

    const reminderDiameter = tokenSize / 2;
    const gap = reminderGap ?? Math.max(6, reminderDiameter * 0.2);
    const baseDistance = avatarSize / 2 + reminderDiameter / 2 + gap;
    const basePoint: Point = {
        x: seatCenter.x + toCenter.x * baseDistance,
        y: seatCenter.y + toCenter.y * baseDistance
    };

    const reminders: Point[] = Array.from({ length: reminderCount }, (_, index) => {
        const distance = index * (reminderDiameter + gap);
        return {
            x: basePoint.x + toCenter.x * distance,
            y: basePoint.y + toCenter.y * distance
        };
    });

    return {
        avatar: seatCenter,
        role: roleCenter,
        reminders
    };
}
