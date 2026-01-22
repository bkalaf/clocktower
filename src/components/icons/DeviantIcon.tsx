// src/components/icons/DeviantIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/deviant.png?url';

export type DeviantIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function DeviantIcon({ className, alt, ...props }: DeviantIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Deviant icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default DeviantIcon;
