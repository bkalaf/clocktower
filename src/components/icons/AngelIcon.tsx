// src/components/icons/AngelIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/angel.png?url';

export type AngelIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AngelIcon({ className, alt, ...props }: AngelIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Angel icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AngelIcon;
