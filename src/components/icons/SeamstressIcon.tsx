// src/components/icons/SeamstressIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/seamstress.png?url';

export type SeamstressIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SeamstressIcon({ className, alt, ...props }: SeamstressIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Seamstress icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SeamstressIcon;
