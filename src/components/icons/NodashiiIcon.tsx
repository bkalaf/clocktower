// src/components/icons/NodashiiIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/nodashii.png?url';

export type NodashiiIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function NodashiiIcon({ className, alt, ...props }: NodashiiIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Nodashii icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default NodashiiIcon;
