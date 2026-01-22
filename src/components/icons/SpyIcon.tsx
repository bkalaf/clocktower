// src/components/icons/SpyIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/spy.png?url';

export type SpyIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SpyIcon({ className, alt, ...props }: SpyIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Spy icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SpyIcon;
