// src/components/icons/AcrobatIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/acrobat.png?url';

export type AcrobatIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AcrobatIcon({ className, alt, ...props }: AcrobatIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Acrobat icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default AcrobatIcon;
