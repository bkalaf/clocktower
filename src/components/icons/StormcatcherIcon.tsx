// src/components/icons/StormcatcherIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/stormcatcher.png?url';

export type StormcatcherIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function StormcatcherIcon({ className, alt, ...props }: StormcatcherIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Stormcatcher icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default StormcatcherIcon;
