// src/components/icons/ScapegoatIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/scapegoat.png?url';

export type ScapegoatIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ScapegoatIcon({ className, alt, ...props }: ScapegoatIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Scapegoat icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ScapegoatIcon;
