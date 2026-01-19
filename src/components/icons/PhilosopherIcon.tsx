// src/components/icons/PhilosopherIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/philosopher.png?url';

export type PhilosopherIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PhilosopherIcon({ className, alt, ...props }: PhilosopherIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Philosopher icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PhilosopherIcon;

