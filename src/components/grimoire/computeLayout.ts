// src/components/grimoire/computeLayout.ts
export type LayoutMode = 'circle' | 'square';

export type Point = {
    x: number;
    y: number;
};

export type CanvasSize = {
    width: number;
    height: number;
};

export type SeatCenter = {
    seatId: string;
    angleRad: number;
    center: Point;
};

export type SeatTokenPositions = {
    avatar: Point;
    role: Point;
    reminderSlots: Point[];
    reminderDirection: Point;
};

const DEFAULT_MARGIN = 32;
export const DEFAULT_GRIMOIRE_MARGIN = DEFAULT_MARGIN;
const REMINDER_SLOT_COUNT = 3;

const normalize = (vector: Point): Point => {
    const length = Math.hypot(vector.x, vector.y);
    if (length === 0) {
        return { x: 0, y: -1 };
    }
    return { x: vector.x / length, y: vector.y / length };
};

const computeAngleFromCenter = (center: Point, tableCenter: Point) => {
    const dx = center.x - tableCenter.x;
    const dy = tableCenter.y - center.y;
    return Math.atan2(dx, dy);
};

const clampMargin = (value?: number) => Math.max(0, value ?? DEFAULT_MARGIN);

const buildSeatIds = (count: number, seatIds?: string[]) =>
    Array.from({ length: count }, (_, index) => seatIds?.[index] ?? `seat-${index}`);

export function computeCircleMaxTokenSize(canvas: CanvasSize, count: number, margin = DEFAULT_MARGIN) {
    const safeWidth = Math.max(0, canvas.width);
    const safeHeight = Math.max(0, canvas.height);
    const safeMargin = clampMargin(margin);
    if (safeWidth === 0 || safeHeight === 0 || count <= 0) {
        return 0;
    }
    const safeHalf = Math.min(safeWidth, safeHeight) / 2;
    const availableRadius = Math.max(0, safeHalf - safeMargin);
    if (availableRadius <= 0) {
        return 0;
    }
    if (count === 1) {
        const maxDiameter = Math.max(0, Math.min(safeWidth, safeHeight) - safeMargin * 2);
        return maxDiameter * 0.8;
    }
    const sinTerm = Math.sin(Math.PI / count);
    if (sinTerm <= 0) {
        return 0;
    }
    const maxAvatar = (2 * availableRadius * sinTerm) / (1 + sinTerm);
    return Math.max(0, maxAvatar * 0.8);
}

export function computeSquareMaxTokenSize(canvas: CanvasSize, count: number, margin = DEFAULT_MARGIN) {
    const safeWidth = Math.max(0, canvas.width);
    const safeHeight = Math.max(0, canvas.height);
    const safeMargin = clampMargin(margin);
    if (safeWidth === 0 || safeHeight === 0 || count <= 0) {
        return 0;
    }
    const availableSpan = safeWidth + safeHeight - safeMargin * 4;
    if (availableSpan <= 0) {
        return 0;
    }
    const maxAvatar = (2 * availableSpan) / (count + 4);
    return Math.max(0, maxAvatar * 0.8);
}

export function computeCircleSeatCenters(options: {
    canvas: CanvasSize;
    count: number;
    avatarSize: number;
    seatIds?: string[];
    margin?: number;
}): SeatCenter[] {
    const { canvas, count, avatarSize, seatIds, margin } = options;
    if (count <= 0) {
        return [];
    }
    const safeWidth = Math.max(0, canvas.width);
    const safeHeight = Math.max(0, canvas.height);
    if (safeWidth === 0 || safeHeight === 0) {
        return [];
    }
    const safeMargin = clampMargin(margin);
    const centerPoint: Point = { x: safeWidth / 2, y: safeHeight / 2 };
    const radius = Math.max(
        0,
        Math.min(safeWidth, safeHeight) / 2 - safeMargin - avatarSize / 2
    );
    const ids = buildSeatIds(count, seatIds);

    if (count === 1) {
        return [
            {
                seatId: ids[0],
                angleRad: computeAngleFromCenter(centerPoint, centerPoint),
                center: centerPoint
            }
        ];
    }

    return ids.map((seatId, index) => {
        const angle = (Math.PI * 2 * index) / count;
        const x = centerPoint.x + radius * Math.sin(angle);
        const y = centerPoint.y - radius * Math.cos(angle);
        const seatCenter = { x, y };
        return {
            seatId,
            angleRad: computeAngleFromCenter(seatCenter, centerPoint),
            center: seatCenter
        };
    });
}

export function computeSquareSeatCenters(options: {
    canvas: CanvasSize;
    count: number;
    avatarSize: number;
    seatIds?: string[];
    margin?: number;
}): SeatCenter[] {
    const { canvas, count, avatarSize, seatIds, margin } = options;
    if (count <= 0) {
        return [];
    }
    const safeWidth = Math.max(0, canvas.width);
    const safeHeight = Math.max(0, canvas.height);
    if (safeWidth === 0 || safeHeight === 0) {
        return [];
    }
    const safeMargin = clampMargin(margin);
    const inset = safeMargin + avatarSize / 2;
    const left = inset;
    const right = Math.max(left, safeWidth - inset);
    const top = inset;
    const bottom = Math.max(top, safeHeight - inset);
    const horizontalLength = Math.max(0, right - left);
    const verticalLength = Math.max(0, bottom - top);
    const perimeter = 2 * (horizontalLength + verticalLength);
    const centerPoint: Point = { x: safeWidth / 2, y: safeHeight / 2 };
    const ids = buildSeatIds(count, seatIds);

    if (perimeter === 0) {
        return ids.map((seatId) => ({
            seatId,
            angleRad: computeAngleFromCenter(centerPoint, centerPoint),
            center: centerPoint
        }));
    }

    return ids.map((seatId, index) => {
        const progress = (perimeter * index) / count;
        const lengths = [horizontalLength, verticalLength, horizontalLength, verticalLength];
        let remaining = progress;
        let x = left;
        let y = top;

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
            seatId,
            angleRad: computeAngleFromCenter(seatCenter, centerPoint),
            center: seatCenter
        };
    });
}

export function computeSeatTokenPositions(args: {
    seatCenter: Point;
    tableCenter: Point;
    avatarSize: number;
    tokenSize: number;
    reminderGap?: number;
}): SeatTokenPositions {
    const { seatCenter, tableCenter, avatarSize, tokenSize, reminderGap } = args;
    const direction = normalize({
        x: tableCenter.x - seatCenter.x,
        y: tableCenter.y - seatCenter.y
    });

    const roleDistance = avatarSize / 2 + tokenSize * 0.1;
    const roleCenter: Point = {
        x: seatCenter.x + direction.x * roleDistance,
        y: seatCenter.y + direction.y * roleDistance
    };

    const reminderDiameter = tokenSize / 2;
    const gap = reminderGap ?? Math.max(6, reminderDiameter * 0.2);
    const baseDistance = avatarSize / 2 + reminderDiameter / 2 + gap;
    const slotSpacing = reminderDiameter + gap;

    const reminderSlots = Array.from({ length: REMINDER_SLOT_COUNT }, (_, index) => {
        const distance = baseDistance + index * slotSpacing;
        return {
            x: seatCenter.x + direction.x * distance,
            y: seatCenter.y + direction.y * distance
        };
    });

    return {
        avatar: seatCenter,
        role: roleCenter,
        reminderSlots,
        reminderDirection: direction
    };
}
