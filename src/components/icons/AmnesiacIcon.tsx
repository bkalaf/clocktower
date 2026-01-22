// src/components/icons/AmnesiacIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/amnesiac.png?url';

export type AmnesiacIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AmnesiacIcon({ className, alt, ...props }: AmnesiacIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Amnesiac icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AmnesiacIcon;
