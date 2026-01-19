// src/components/icons/RecluseIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/recluse.png?url';

export type RecluseIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function RecluseIcon({ className, alt, ...props }: RecluseIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Recluse icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default RecluseIcon;

