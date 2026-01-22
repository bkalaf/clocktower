// src/components/icons/PithagIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/pithag.png?url';

export type PithagIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PithagIcon({ className, alt, ...props }: PithagIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Pithag icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PithagIcon;
