// src/components/icons/GossipIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/gossip.png?url';

export type GossipIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GossipIcon({ className, alt, ...props }: GossipIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Gossip icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GossipIcon;

