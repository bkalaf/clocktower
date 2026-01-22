// src/components/icons/ChefIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/chef.png?url';

export type ChefIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ChefIcon({ className, alt, ...props }: ChefIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Chef icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ChefIcon;
