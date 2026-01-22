// src/components/icons/BaronIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/baron.png?url';

export type BaronIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BaronIcon({ className, alt, ...props }: BaronIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Baron icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BaronIcon;
