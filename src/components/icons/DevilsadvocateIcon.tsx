// src/components/icons/DevilsadvocateIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/devilsadvocate.png?url';

export type DevilsadvocateIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DevilsadvocateIcon({ className, alt, ...props }: DevilsadvocateIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Devilsadvocate icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DevilsadvocateIcon;

