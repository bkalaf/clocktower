// src/components/icons/EngineerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/engineer.png?url';

export type EngineerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function EngineerIcon({ className, alt, ...props }: EngineerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Engineer icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default EngineerIcon;
