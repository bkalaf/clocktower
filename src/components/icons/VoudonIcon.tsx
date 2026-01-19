// src/components/icons/VoudonIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/voudon.png?url';

export type VoudonIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function VoudonIcon({ className, alt, ...props }: VoudonIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Voudon icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default VoudonIcon;

