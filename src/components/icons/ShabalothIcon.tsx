// src/components/icons/ShabalothIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/shabaloth.png?url';

export type ShabalothIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ShabalothIcon({ className, alt, ...props }: ShabalothIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Shabaloth icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ShabalothIcon;
