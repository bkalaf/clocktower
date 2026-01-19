// src/components/icons/GoblinIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/goblin.png?url';

export type GoblinIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GoblinIcon({ className, alt, ...props }: GoblinIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Goblin icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GoblinIcon;

