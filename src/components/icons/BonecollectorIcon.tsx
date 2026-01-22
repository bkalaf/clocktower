// src/components/icons/BonecollectorIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/bonecollector.png?url';

export type BonecollectorIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function BonecollectorIcon({ className, alt, ...props }: BonecollectorIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Bonecollector icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default BonecollectorIcon;
