// src/components/icons/ExorcistIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/exorcist.png?url';

export type ExorcistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ExorcistIcon({ className, alt, ...props }: ExorcistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Exorcist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ExorcistIcon;

