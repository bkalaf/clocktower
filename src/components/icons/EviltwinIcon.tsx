// src/components/icons/EviltwinIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/eviltwin.png?url';

export type EviltwinIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function EviltwinIcon({ className, alt, ...props }: EviltwinIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Eviltwin icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default EviltwinIcon;
