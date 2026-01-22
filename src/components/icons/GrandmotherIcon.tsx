// src/components/icons/GrandmotherIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/grandmother.png?url';

export type GrandmotherIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GrandmotherIcon({ className, alt, ...props }: GrandmotherIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Grandmother icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GrandmotherIcon;
