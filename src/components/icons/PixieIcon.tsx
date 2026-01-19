// src/components/icons/PixieIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/pixie.png?url';

export type PixieIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PixieIcon({ className, alt, ...props }: PixieIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Pixie icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PixieIcon;

