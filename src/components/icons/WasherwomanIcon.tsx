// src/components/icons/WasherwomanIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/washerwoman.png?url';

export type WasherwomanIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function WasherwomanIcon({ className, alt, ...props }: WasherwomanIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Washerwoman icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default WasherwomanIcon;
