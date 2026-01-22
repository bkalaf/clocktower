// src/components/icons/DeusexfiascoIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/deusexfiasco.png?url';

export type DeusexfiascoIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DeusexfiascoIcon({ className, alt, ...props }: DeusexfiascoIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Deusexfiasco icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DeusexfiascoIcon;
