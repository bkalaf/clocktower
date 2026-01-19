// src/components/icons/MathematicianIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/mathematician.png?url';

export type MathematicianIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MathematicianIcon({ className, alt, ...props }: MathematicianIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Mathematician icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MathematicianIcon;

