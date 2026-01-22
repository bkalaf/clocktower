// src/components/icons/BoomdandyIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/boomdandy.png?url';

export type BoomdandyIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BoomdandyIcon({ className, alt, ...props }: BoomdandyIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Boomdandy icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BoomdandyIcon;
