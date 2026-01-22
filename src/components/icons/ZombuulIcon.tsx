// src/components/icons/ZombuulIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/zombuul.png?url';

export type ZombuulIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ZombuulIcon({ className, alt, ...props }: ZombuulIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Zombuul icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ZombuulIcon;
