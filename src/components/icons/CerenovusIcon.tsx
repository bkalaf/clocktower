// src/components/icons/CerenovusIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/cerenovus.png?url';

export type CerenovusIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CerenovusIcon({ className, alt, ...props }: CerenovusIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Cerenovus icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default CerenovusIcon;
