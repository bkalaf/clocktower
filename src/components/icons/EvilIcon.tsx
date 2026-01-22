// src/components/icons/EvilIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/evil.png?url';

export type EvilIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function EvilIcon({ className, alt, ...props }: EvilIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Evil icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default EvilIcon;
