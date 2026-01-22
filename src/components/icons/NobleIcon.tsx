// src/components/icons/NobleIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/noble.png?url';

export type NobleIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function NobleIcon({ className, alt, ...props }: NobleIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Noble icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default NobleIcon;
