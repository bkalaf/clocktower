// src/components/icons/VigormortisIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/vigormortis.png?url';

export type VigormortisIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function VigormortisIcon({ className, alt, ...props }: VigormortisIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Vigormortis icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default VigormortisIcon;
