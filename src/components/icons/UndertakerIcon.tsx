// src/components/icons/UndertakerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/undertaker.png?url';

export type UndertakerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function UndertakerIcon({ className, alt, ...props }: UndertakerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Undertaker icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default UndertakerIcon;
