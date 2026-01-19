// src/components/icons/DjinnIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/djinn.png?url';

export type DjinnIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DjinnIcon({ className, alt, ...props }: DjinnIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Djinn icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DjinnIcon;

