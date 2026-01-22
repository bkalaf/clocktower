// src/components/icons/PreacherIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/preacher.png?url';

export type PreacherIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PreacherIcon({ className, alt, ...props }: PreacherIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Preacher icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PreacherIcon;
