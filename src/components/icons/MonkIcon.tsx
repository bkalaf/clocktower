// src/components/icons/MonkIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/monk.png?url';

export type MonkIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function MonkIcon({ className, alt, ...props }: MonkIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Monk icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default MonkIcon;
