// src/components/icons/AssassinIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/assassin.png?url';

export type AssassinIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AssassinIcon({ className, alt, ...props }: AssassinIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Assassin icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AssassinIcon;
