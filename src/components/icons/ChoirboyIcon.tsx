// src/components/icons/ChoirboyIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/choirboy.png?url';

export type ChoirboyIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ChoirboyIcon({ className, alt, ...props }: ChoirboyIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Choirboy icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ChoirboyIcon;
