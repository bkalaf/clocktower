// src/components/icons/ArtistIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/artist.png?url';

export type ArtistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ArtistIcon({ className, alt, ...props }: ArtistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Artist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ArtistIcon;
