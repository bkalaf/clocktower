// src/components/icons/ProfessorIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/professor.png?url';

export type ProfessorIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ProfessorIcon({ className, alt, ...props }: ProfessorIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Professor icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ProfessorIcon;
