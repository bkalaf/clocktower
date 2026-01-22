// src/components/icons/FlowergirlIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/flowergirl.png?url';

export type FlowergirlIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FlowergirlIcon({ className, alt, ...props }: FlowergirlIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Flowergirl icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FlowergirlIcon;
