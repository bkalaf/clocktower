// src/components/icons/SpiritofivoryIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/spiritofivory.png?url';

export type SpiritofivoryIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SpiritofivoryIcon({ className, alt, ...props }: SpiritofivoryIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Spiritofivory icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SpiritofivoryIcon;
