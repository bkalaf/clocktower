// src/components/icons/LilmonstaIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/lilmonsta.png?url';

export type LilmonstaIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LilmonstaIcon({ className, alt, ...props }: LilmonstaIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Lilmonsta icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LilmonstaIcon;

