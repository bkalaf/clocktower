// src/components/icons/MastermindIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/mastermind.png?url';

export type MastermindIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MastermindIcon({ className, alt, ...props }: MastermindIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Mastermind icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MastermindIcon;

