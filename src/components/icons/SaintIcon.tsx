// src/components/icons/SaintIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/saint.png?url';

export type SaintIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SaintIcon({ className, alt, ...props }: SaintIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Saint icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SaintIcon;

