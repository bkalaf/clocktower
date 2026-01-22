// src/components/icons/MutantIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/mutant.png?url';

export type MutantIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MutantIcon({ className, alt, ...props }: MutantIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Mutant icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MutantIcon;
