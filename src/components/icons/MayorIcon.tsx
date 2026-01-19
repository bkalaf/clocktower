// src/components/icons/MayorIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/mayor.png?url';

export type MayorIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MayorIcon({ className, alt, ...props }: MayorIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Mayor icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MayorIcon;

