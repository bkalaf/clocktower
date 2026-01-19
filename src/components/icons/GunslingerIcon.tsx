// src/components/icons/GunslingerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/gunslinger.png?url';

export type GunslingerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GunslingerIcon({ className, alt, ...props }: GunslingerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Gunslinger icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GunslingerIcon;

