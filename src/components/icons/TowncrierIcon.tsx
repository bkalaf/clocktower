// src/components/icons/TowncrierIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/towncrier.png?url';

export type TowncrierIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function TowncrierIcon({ className, alt, ...props }: TowncrierIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Towncrier icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default TowncrierIcon;
