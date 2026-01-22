// src/components/icons/HellslibrarianIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/hellslibrarian.png?url';

export type HellslibrarianIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function HellslibrarianIcon({ className, alt, ...props }: HellslibrarianIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Hellslibrarian icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default HellslibrarianIcon;
