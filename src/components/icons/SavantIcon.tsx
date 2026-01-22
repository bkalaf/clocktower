// src/components/icons/SavantIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/savant.png?url';

export type SavantIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function SavantIcon({ className, alt, ...props }: SavantIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Savant icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default SavantIcon;
