// src/components/icons/LegionIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/legion.png?url';

export type LegionIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LegionIcon({ className, alt, ...props }: LegionIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Legion icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LegionIcon;
