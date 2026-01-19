// src/components/icons/OutsiderIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/outsider.png?url';

export type OutsiderIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function OutsiderIcon({ className, alt, ...props }: OutsiderIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Outsider icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default OutsiderIcon;

