// src/components/icons/HereticIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/heretic.png?url';

export type HereticIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function HereticIcon({ className, alt, ...props }: HereticIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Heretic icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default HereticIcon;
