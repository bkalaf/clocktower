// src/components/icons/NightwatchmanIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/nightwatchman.png?url';

export type NightwatchmanIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function NightwatchmanIcon({ className, alt, ...props }: NightwatchmanIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Nightwatchman icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default NightwatchmanIcon;
