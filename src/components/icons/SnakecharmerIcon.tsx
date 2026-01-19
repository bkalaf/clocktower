// src/components/icons/SnakecharmerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/snakecharmer.png?url';

export type SnakecharmerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SnakecharmerIcon({ className, alt, ...props }: SnakecharmerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Snakecharmer icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SnakecharmerIcon;

