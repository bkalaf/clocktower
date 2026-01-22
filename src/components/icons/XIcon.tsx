// src/components/icons/XIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/x.png?url';

export type XIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function XIcon({ className, alt, ...props }: XIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'X icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default XIcon;
