// src/components/icons/BuddhistIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/buddhist.png?url';

export type BuddhistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BuddhistIcon({ className, alt, ...props }: BuddhistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Buddhist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BuddhistIcon;
