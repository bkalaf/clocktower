// src/components/icons/MinstrelIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/minstrel.png?url';

export type MinstrelIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MinstrelIcon({ className, alt, ...props }: MinstrelIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Minstrel icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MinstrelIcon;

