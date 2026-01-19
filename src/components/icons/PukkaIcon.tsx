// src/components/icons/PukkaIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/pukka.png?url';

export type PukkaIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PukkaIcon({ className, alt, ...props }: PukkaIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Pukka icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PukkaIcon;

