// src/components/icons/MephitIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/mephit.png?url';

export type MephitIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MephitIcon({ className, alt, ...props }: MephitIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Mephit icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MephitIcon;

