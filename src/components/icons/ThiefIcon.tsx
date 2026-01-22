// src/components/icons/ThiefIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/thief.png?url';

export type ThiefIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ThiefIcon({ className, alt, ...props }: ThiefIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Thief icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ThiefIcon;
