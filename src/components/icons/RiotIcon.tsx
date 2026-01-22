// src/components/icons/RiotIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/riot.png?url';

export type RiotIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function RiotIcon({ className, alt, ...props }: RiotIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Riot icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default RiotIcon;
