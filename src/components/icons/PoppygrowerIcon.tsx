// src/components/icons/PoppygrowerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/poppygrower.png?url';

export type PoppygrowerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PoppygrowerIcon({ className, alt, ...props }: PoppygrowerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Poppygrower icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PoppygrowerIcon;

