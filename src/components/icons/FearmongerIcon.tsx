// src/components/icons/FearmongerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fearmonger.png?url';

export type FearmongerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FearmongerIcon({ className, alt, ...props }: FearmongerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fearmonger icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FearmongerIcon;
