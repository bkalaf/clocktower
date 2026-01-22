// src/components/icons/GangsterIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/gangster.png?url';

export type GangsterIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GangsterIcon({ className, alt, ...props }: GangsterIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Gangster icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GangsterIcon;
