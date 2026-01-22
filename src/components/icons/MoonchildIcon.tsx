// src/components/icons/MoonchildIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/moonchild.png?url';

export type MoonchildIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MoonchildIcon({ className, alt, ...props }: MoonchildIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Moonchild icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MoonchildIcon;
