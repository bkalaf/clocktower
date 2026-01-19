// src/components/icons/DuchessIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/duchess.png?url';

export type DuchessIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DuchessIcon({ className, alt, ...props }: DuchessIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Duchess icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DuchessIcon;

