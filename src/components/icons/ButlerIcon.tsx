// src/components/icons/ButlerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/butler.png?url';

export type ButlerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ButlerIcon({ className, alt, ...props }: ButlerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Butler icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ButlerIcon;
