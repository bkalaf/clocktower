import * as React from 'react';

export type MeasuredRect = {
    width: number;
    height: number;
};

export function useMeasuredRect<T extends Element>(ref: React.RefObject<T>) {
    const [rect, setRect] = React.useState<MeasuredRect>({ width: 0, height: 0 });

    React.useLayoutEffect(() => {
        const node = ref.current;
        if (!node) {
            return;
        }

        const updateRect = () => {
            if (!node) {
                return;
            }
            const { width, height } = node.getBoundingClientRect();
            setRect({
                width: Math.max(0, width - 10),
                height: Math.max(0, height - 10)
            });
        };

        updateRect();

        if (typeof ResizeObserver === 'undefined') {
            if (typeof window === 'undefined') {
                return;
            }
            const handleResize = () => updateRect();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }

        const observer = new ResizeObserver(updateRect);
        observer.observe(node);
        return () => observer.disconnect();
    }, [ref]);

    return rect;
}
