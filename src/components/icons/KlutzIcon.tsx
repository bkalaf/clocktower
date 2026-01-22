// src/components/icons/KlutzIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/klutz.png?url';

export type KlutzIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function KlutzIcon({ className, alt, ...props }: KlutzIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Klutz icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default KlutzIcon;
