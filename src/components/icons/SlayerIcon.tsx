// src/components/icons/SlayerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/slayer.png?url';

export type SlayerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SlayerIcon({ className, alt, ...props }: SlayerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Slayer icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SlayerIcon;

