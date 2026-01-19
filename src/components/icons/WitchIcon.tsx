// src/components/icons/WitchIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/witch.png?url';

export type WitchIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function WitchIcon({ className, alt, ...props }: WitchIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Witch icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default WitchIcon;

