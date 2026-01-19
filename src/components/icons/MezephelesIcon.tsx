// src/components/icons/MezephelesIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/mezepheles.png?url';

export type MezephelesIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MezephelesIcon({ className, alt, ...props }: MezephelesIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Mezepheles icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MezephelesIcon;

