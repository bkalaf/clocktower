// src/components/icons/JugglerIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/juggler.png?url';

export type JugglerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function JugglerIcon({ className, alt, ...props }: JugglerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Juggler icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default JugglerIcon;
