// src/components/icons/PoisonerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/poisoner.png?url';

export type PoisonerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PoisonerIcon({ className, alt, ...props }: PoisonerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Poisoner icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PoisonerIcon;
