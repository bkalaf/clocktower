import * as React from 'react';

import { Grimoire, type GrimoireSeat } from './Grimoire';
import { LayoutMode, type Point } from './computeLayout';
import { useMeasuredRect } from '@/hooks/useMeasuredRect';

type GrimoireCanvasProps = {
    seats: GrimoireSeat[];
    layout: LayoutMode;
    tokenSize: number;
    margin?: number;
    tableCenter?: Point;
    onMeasure?: (rect: { width: number; height: number }) => void;
};

export function GrimoireCanvas({ seats, layout, tokenSize, margin, tableCenter }: GrimoireCanvasProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { width, height } = useMeasuredRect(containerRef);
    React.useEffect(() => {
        onMeasure?.({ width, height });
    }, [width, height, onMeasure]);
    const derivedCenter = React.useMemo(
        () => ({ x: width / 2, y: height / 2 }),
        [width, height]
    );

    return (
        <div
            ref={containerRef}
            className='relative flex-1 overflow-hidden'
            style={{ padding: '5px' }}
        >
            <div className='absolute inset-0'>
                <Grimoire
                    seats={seats}
                    layout={layout}
                    tokenSize={tokenSize}
                    canvasWidth={width}
                    canvasHeight={height}
                    tableCenter={tableCenter ?? derivedCenter}
                    margin={margin}
                />
            </div>
        </div>
    );
}
