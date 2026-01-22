// src/components/icons/HuntsmanIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/huntsman.png?url';

export type HuntsmanIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function HuntsmanIcon({ className, alt, ...props }: HuntsmanIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Huntsman icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default HuntsmanIcon;
