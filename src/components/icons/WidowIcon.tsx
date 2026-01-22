// src/components/icons/WidowIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/widow.png?url';

export type WidowIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function WidowIcon({ className, alt, ...props }: WidowIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Widow icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default WidowIcon;
