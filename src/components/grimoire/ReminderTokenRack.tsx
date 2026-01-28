import type { Point } from './computeLayout';
import type { ReminderDot } from './types';

const stackOffsets = (count: number, index: number) => {
    const axisShift = -index * 1.5;
    const perpShift = (index - (count - 1) / 2) * 3;
    return { axisShift, perpShift };
};

type ReminderTokenRackProps = {
    tokens: ReminderDot[];
    slots: Point[];
    direction: Point;
    size: number;
};

export function ReminderTokenRack({ tokens, slots, direction, size }: ReminderTokenRackProps) {
    const renderSlotToken = (token: ReminderDot, slot: Point, index: number) => {
        const left = slot.x - size / 2;
        const top = slot.y - size / 2;
        return (
            <div
                key={`${token.label}-${index}`}
                className='absolute flex items-center justify-center rounded-full border border-white/30 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                style={{
                    left,
                    top,
                    width: size,
                    height: size,
                    backgroundColor: token.color ?? 'rgba(59,130,246,0.8)',
                    zIndex: 20 + index
                }}
            >
                {token.label.charAt(0)}
            </div>
        );
    };

    if (tokens.length === 0) {
        return null;
    }

    if (tokens.length <= 3) {
        return (
            <>
                {tokens.map((token, index) => {
                    const slot = slots[index];
                    if (!slot) return null;
                    return renderSlotToken(token, slot, index);
                })}
            </>
        );
    }

    const anchor = slots[slots.length - 1] ?? slots[0];
    if (!anchor) {
        return null;
    }
    const perp: Point = { x: -direction.y, y: direction.x };
    return (
        <>
            {tokens.map((token, index) => {
                const { axisShift, perpShift } = stackOffsets(tokens.length, index);
                const position = {
                    x: anchor.x + direction.x * axisShift + perp.x * perpShift,
                    y: anchor.y + direction.y * axisShift + perp.y * perpShift
                };
                const left = position.x - size / 2;
                const top = position.y - size / 2;

                return (
                    <div
                        key={`${token.label}-${index}`}
                        className='absolute flex items-center justify-center rounded-full border border-white/30 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                        style={{
                            left,
                            top,
                            width: size,
                            height: size,
                            backgroundColor: token.color ?? 'rgba(59,130,246,0.8)',
                            zIndex: 20 + index
                        }}
                    >
                        {token.label.charAt(0)}
                    </div>
                );
            })}
        </>
    );
}
