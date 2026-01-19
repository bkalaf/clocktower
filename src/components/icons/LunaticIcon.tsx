// src/components/icons/LunaticIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/lunatic.png?url';

export type LunaticIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LunaticIcon({ className, alt, ...props }: LunaticIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Lunatic icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LunaticIcon;

