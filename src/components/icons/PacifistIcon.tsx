// src/components/icons/PacifistIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/pacifist.png?url';

export type PacifistIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function PacifistIcon({ className, alt, ...props }: PacifistIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Pacifist icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default PacifistIcon;
