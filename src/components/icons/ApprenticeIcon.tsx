// src/components/icons/ApprenticeIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/apprentice.png?url';

export type ApprenticeIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ApprenticeIcon({ className, alt, ...props }: ApprenticeIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Apprentice icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ApprenticeIcon;

