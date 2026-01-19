// src/components/icons/GoodIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/good.png?url';

export type GoodIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GoodIcon({ className, alt, ...props }: GoodIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Good icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GoodIcon;

