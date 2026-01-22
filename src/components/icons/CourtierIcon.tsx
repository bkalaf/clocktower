// src/components/icons/CourtierIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/courtier.png?url';

export type CourtierIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CourtierIcon({ className, alt, ...props }: CourtierIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Courtier icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default CourtierIcon;
