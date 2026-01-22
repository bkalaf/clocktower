// src/components/icons/GoonIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/goon.png?url';

export type GoonIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GoonIcon({ className, alt, ...props }: GoonIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Goon icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GoonIcon;
