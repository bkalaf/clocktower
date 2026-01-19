// src/components/icons/MinionIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/minion.png?url';

export type MinionIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MinionIcon({ className, alt, ...props }: MinionIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Minion icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MinionIcon;

