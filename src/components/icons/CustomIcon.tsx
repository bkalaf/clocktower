// src/components/icons/CustomIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/custom.png?url';

export type CustomIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CustomIcon({ className, alt, ...props }: CustomIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Custom icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default CustomIcon;
