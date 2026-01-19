// src/components/icons/BeggarIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/beggar.png?url';

export type BeggarIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BeggarIcon({ className, alt, ...props }: BeggarIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Beggar icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BeggarIcon;

