// src/components/icons/MatronIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/matron.png?url';

export type MatronIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MatronIcon({ className, alt, ...props }: MatronIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Matron icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MatronIcon;
