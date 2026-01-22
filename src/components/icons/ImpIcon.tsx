// src/components/icons/ImpIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/imp.png?url';

export type ImpIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ImpIcon({ className, alt, ...props }: ImpIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Imp icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ImpIcon;
