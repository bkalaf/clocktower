// src/components/icons/RevolutionaryIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/revolutionary.png?url';

export type RevolutionaryIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function RevolutionaryIcon({ className, alt, ...props }: RevolutionaryIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Revolutionary icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default RevolutionaryIcon;

