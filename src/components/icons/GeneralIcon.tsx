// src/components/icons/GeneralIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/general.png?url';

export type GeneralIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GeneralIcon({ className, alt, ...props }: GeneralIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'General icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GeneralIcon;
