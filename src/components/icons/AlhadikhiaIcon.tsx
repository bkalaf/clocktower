// src/components/icons/AlhadikhiaIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/alhadikhia.png?url';

export type AlhadikhiaIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AlhadikhiaIcon({ className, alt, ...props }: AlhadikhiaIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Alhadikhia icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AlhadikhiaIcon;
