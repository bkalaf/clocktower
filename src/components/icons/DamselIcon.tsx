// src/components/icons/DamselIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/damsel.png?url';

export type DamselIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DamselIcon({ className, alt, ...props }: DamselIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Damsel icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DamselIcon;

