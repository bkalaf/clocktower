// src/components/icons/PoliticianIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/politician.png?url';

export type PoliticianIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PoliticianIcon({ className, alt, ...props }: PoliticianIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Politician icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PoliticianIcon;
