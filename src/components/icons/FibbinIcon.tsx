// src/components/icons/FibbinIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fibbin.png?url';

export type FibbinIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FibbinIcon({ className, alt, ...props }: FibbinIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fibbin icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FibbinIcon;
