// src/components/icons/CannibalIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/cannibal.png?url';

export type CannibalIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CannibalIcon({ className, alt, ...props }: CannibalIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Cannibal icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default CannibalIcon;
