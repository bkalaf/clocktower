// src/components/icons/SentinelIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/sentinel.png?url';

export type SentinelIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SentinelIcon({ className, alt, ...props }: SentinelIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Sentinel icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SentinelIcon;
