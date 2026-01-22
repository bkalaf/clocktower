// src/components/icons/KingIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/king.png?url';

export type KingIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function KingIcon({ className, alt, ...props }: KingIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'King icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default KingIcon;
