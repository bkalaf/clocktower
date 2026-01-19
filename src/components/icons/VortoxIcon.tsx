// src/components/icons/VortoxIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/vortox.png?url';

export type VortoxIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function VortoxIcon({ className, alt, ...props }: VortoxIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Vortox icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default VortoxIcon;

