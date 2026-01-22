// src/components/icons/TealadyIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/tealady.png?url';

export type TealadyIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function TealadyIcon({ className, alt, ...props }: TealadyIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Tealady icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default TealadyIcon;
