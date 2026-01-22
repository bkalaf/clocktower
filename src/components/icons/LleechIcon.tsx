// src/components/icons/LleechIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/lleech.png?url';

export type LleechIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LleechIcon({ className, alt, ...props }: LleechIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Lleech icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LleechIcon;
