// src/components/icons/FortunetellerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fortuneteller.png?url';

export type FortunetellerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FortunetellerIcon({ className, alt, ...props }: FortunetellerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fortuneteller icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FortunetellerIcon;

