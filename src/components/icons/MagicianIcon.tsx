// src/components/icons/MagicianIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/magician.png?url';

export type MagicianIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MagicianIcon({ className, alt, ...props }: MagicianIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Magician icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MagicianIcon;
