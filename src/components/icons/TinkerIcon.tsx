// src/components/icons/TinkerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/tinker.png?url';

export type TinkerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function TinkerIcon({ className, alt, ...props }: TinkerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Tinker icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default TinkerIcon;
