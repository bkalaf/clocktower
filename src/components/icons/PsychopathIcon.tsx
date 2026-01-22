// src/components/icons/PsychopathIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/psychopath.png?url';

export type PsychopathIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PsychopathIcon({ className, alt, ...props }: PsychopathIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Psychopath icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PsychopathIcon;
