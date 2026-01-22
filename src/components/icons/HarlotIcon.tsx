// src/components/icons/HarlotIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/harlot.png?url';

export type HarlotIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function HarlotIcon({ className, alt, ...props }: HarlotIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Harlot icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default HarlotIcon;
