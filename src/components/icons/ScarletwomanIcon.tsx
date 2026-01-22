// src/components/icons/ScarletwomanIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/scarletwoman.png?url';

export type ScarletwomanIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ScarletwomanIcon({ className, alt, ...props }: ScarletwomanIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Scarletwoman icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ScarletwomanIcon;
