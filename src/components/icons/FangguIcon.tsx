// src/components/icons/FangguIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fanggu.png?url';

export type FangguIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FangguIcon({ className, alt, ...props }: FangguIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fanggu icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FangguIcon;

