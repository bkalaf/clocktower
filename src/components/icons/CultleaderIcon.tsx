// src/components/icons/CultleaderIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/cultleader.png?url';

export type CultleaderIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function CultleaderIcon({ className, alt, ...props }: CultleaderIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Cultleader icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default CultleaderIcon;
