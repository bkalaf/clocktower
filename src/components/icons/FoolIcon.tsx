// src/components/icons/FoolIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fool.png?url';

export type FoolIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FoolIcon({ className, alt, ...props }: FoolIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fool icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FoolIcon;
