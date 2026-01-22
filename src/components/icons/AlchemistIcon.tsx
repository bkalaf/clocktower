// src/components/icons/AlchemistIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/alchemist.png?url';

export type AlchemistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AlchemistIcon({ className, alt, ...props }: AlchemistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Alchemist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AlchemistIcon;
