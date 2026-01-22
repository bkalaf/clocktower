// src/components/icons/PoIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/po.png?url';

export type PoIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PoIcon({ className, alt, ...props }: PoIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Po icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PoIcon;
