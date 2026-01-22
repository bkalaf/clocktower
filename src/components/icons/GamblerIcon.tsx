// src/components/icons/GamblerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/gambler.png?url';

export type GamblerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GamblerIcon({ className, alt, ...props }: GamblerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Gambler icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GamblerIcon;
