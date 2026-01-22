// src/components/icons/FishermanIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fisherman.png?url';

export type FishermanIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FishermanIcon({ className, alt, ...props }: FishermanIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fisherman icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FishermanIcon;
