// src/components/icons/BountyhunterIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/bountyhunter.png?url';

export type BountyhunterIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BountyhunterIcon({ className, alt, ...props }: BountyhunterIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Bountyhunter icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BountyhunterIcon;
