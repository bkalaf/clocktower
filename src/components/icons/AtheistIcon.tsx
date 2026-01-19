// src/components/icons/AtheistIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/atheist.png?url';

export type AtheistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AtheistIcon({ className, alt, ...props }: AtheistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Atheist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AtheistIcon;

