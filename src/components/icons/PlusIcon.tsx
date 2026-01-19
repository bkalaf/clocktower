// src/components/icons/PlusIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/plus.png?url';

export type PlusIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PlusIcon({ className, alt, ...props }: PlusIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Plus icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PlusIcon;

