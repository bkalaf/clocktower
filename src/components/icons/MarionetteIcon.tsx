// src/components/icons/MarionetteIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/marionette.png?url';

export type MarionetteIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MarionetteIcon({ className, alt, ...props }: MarionetteIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Marionette icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MarionetteIcon;
