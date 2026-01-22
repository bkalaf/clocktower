// src/components/icons/VirginIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/virgin.png?url';

export type VirginIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function VirginIcon({ className, alt, ...props }: VirginIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Virgin icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default VirginIcon;
