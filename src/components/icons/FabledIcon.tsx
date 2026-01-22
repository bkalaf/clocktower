// src/components/icons/FabledIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fabled.png?url';

export type FabledIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FabledIcon({ className, alt, ...props }: FabledIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fabled icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FabledIcon;
