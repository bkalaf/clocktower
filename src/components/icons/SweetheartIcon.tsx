// src/components/icons/SweetheartIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/sweetheart.png?url';

export type SweetheartIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SweetheartIcon({ className, alt, ...props }: SweetheartIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Sweetheart icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SweetheartIcon;

