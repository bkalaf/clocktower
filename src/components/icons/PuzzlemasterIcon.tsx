// src/components/icons/PuzzlemasterIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/puzzlemaster.png?url';

export type PuzzlemasterIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PuzzlemasterIcon({ className, alt, ...props }: PuzzlemasterIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Puzzlemaster icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PuzzlemasterIcon;

