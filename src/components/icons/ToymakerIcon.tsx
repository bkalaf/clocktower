// src/components/icons/ToymakerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/toymaker.png?url';

export type ToymakerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ToymakerIcon({ className, alt, ...props }: ToymakerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Toymaker icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ToymakerIcon;

