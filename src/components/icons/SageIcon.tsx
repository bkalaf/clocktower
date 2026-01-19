// src/components/icons/SageIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/sage.png?url';

export type SageIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SageIcon({ className, alt, ...props }: SageIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Sage icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SageIcon;

