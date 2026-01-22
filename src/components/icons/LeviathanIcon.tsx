// src/components/icons/LeviathanIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/leviathan.png?url';

export type LeviathanIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LeviathanIcon({ className, alt, ...props }: LeviathanIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Leviathan icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LeviathanIcon;
