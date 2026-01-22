// src/components/icons/BureaucratIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/bureaucrat.png?url';

export type BureaucratIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BureaucratIcon({ className, alt, ...props }: BureaucratIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Bureaucrat icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BureaucratIcon;
