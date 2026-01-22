// src/components/icons/LycanthropeIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/lycanthrope.png?url';

export type LycanthropeIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LycanthropeIcon({ className, alt, ...props }: LycanthropeIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Lycanthrope icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LycanthropeIcon;
