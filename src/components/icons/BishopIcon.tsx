// src/components/icons/BishopIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/bishop.png?url';

export type BishopIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BishopIcon({ className, alt, ...props }: BishopIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Bishop icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BishopIcon;
