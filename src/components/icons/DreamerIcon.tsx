// src/components/icons/DreamerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/dreamer.png?url';

export type DreamerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DreamerIcon({ className, alt, ...props }: DreamerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Dreamer icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DreamerIcon;
