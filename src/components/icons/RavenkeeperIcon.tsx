// src/components/icons/RavenkeeperIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/ravenkeeper.png?url';

export type RavenkeeperIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function RavenkeeperIcon({ className, alt, ...props }: RavenkeeperIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Ravenkeeper icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default RavenkeeperIcon;
