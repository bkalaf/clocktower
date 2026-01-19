// src/components/icons/ClockmakerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/clockmaker.png?url';

export type ClockmakerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ClockmakerIcon({ className, alt, ...props }: ClockmakerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Clockmaker icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ClockmakerIcon;

