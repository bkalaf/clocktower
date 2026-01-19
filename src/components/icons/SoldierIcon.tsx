// src/components/icons/SoldierIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/soldier.png?url';

export type SoldierIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SoldierIcon({ className, alt, ...props }: SoldierIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Soldier icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SoldierIcon;

