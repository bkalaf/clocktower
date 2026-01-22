// src/components/icons/DoomsayerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/doomsayer.png?url';

export type DoomsayerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DoomsayerIcon({ className, alt, ...props }: DoomsayerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Doomsayer icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DoomsayerIcon;
