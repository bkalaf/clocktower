// src/components/icons/BalloonistIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/balloonist.png?url';

export type BalloonistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BalloonistIcon({ className, alt, ...props }: BalloonistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Balloonist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BalloonistIcon;

