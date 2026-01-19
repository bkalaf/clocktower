// src/components/icons/InnkeeperIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/innkeeper.png?url';

export type InnkeeperIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function InnkeeperIcon({ className, alt, ...props }: InnkeeperIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Innkeeper icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default InnkeeperIcon;

