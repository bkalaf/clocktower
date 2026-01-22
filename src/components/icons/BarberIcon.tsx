// src/components/icons/BarberIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/barber.png?url';

export type BarberIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BarberIcon({ className, alt, ...props }: BarberIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Barber icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BarberIcon;
