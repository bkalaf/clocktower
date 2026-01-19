// src/components/icons/BaristaIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/barista.png?url';

export type BaristaIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BaristaIcon({ className, alt, ...props }: BaristaIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Barista icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BaristaIcon;

