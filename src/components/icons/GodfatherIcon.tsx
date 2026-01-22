// src/components/icons/GodfatherIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/godfather.png?url';

export type GodfatherIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GodfatherIcon({ className, alt, ...props }: GodfatherIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Godfather icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GodfatherIcon;
