// src/components/icons/SnitchIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/snitch.png?url';

export type SnitchIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SnitchIcon({ className, alt, ...props }: SnitchIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Snitch icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SnitchIcon;
