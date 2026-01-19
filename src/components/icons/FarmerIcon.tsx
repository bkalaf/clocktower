// src/components/icons/FarmerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/farmer.png?url';

export type FarmerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FarmerIcon({ className, alt, ...props }: FarmerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Farmer icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FarmerIcon;

