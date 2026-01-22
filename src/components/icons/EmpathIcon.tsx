// src/components/icons/EmpathIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/empath.png?url';

export type EmpathIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function EmpathIcon({ className, alt, ...props }: EmpathIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Empath icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default EmpathIcon;
