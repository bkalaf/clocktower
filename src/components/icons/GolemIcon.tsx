// src/components/icons/GolemIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/golem.png?url';

export type GolemIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function GolemIcon({ className, alt, ...props }: GolemIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Golem icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default GolemIcon;
