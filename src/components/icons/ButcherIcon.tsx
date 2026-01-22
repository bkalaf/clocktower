// src/components/icons/ButcherIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/butcher.png?url';

export type ButcherIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ButcherIcon({ className, alt, ...props }: ButcherIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Butcher icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ButcherIcon;
