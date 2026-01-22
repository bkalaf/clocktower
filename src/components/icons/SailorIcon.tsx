// src/components/icons/SailorIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/sailor.png?url';

export type SailorIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SailorIcon({ className, alt, ...props }: SailorIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Sailor icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SailorIcon;
