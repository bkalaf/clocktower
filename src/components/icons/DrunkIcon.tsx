// src/components/icons/DrunkIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/drunk.png?url';

export type DrunkIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DrunkIcon({ className, alt, ...props }: DrunkIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Drunk icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DrunkIcon;
