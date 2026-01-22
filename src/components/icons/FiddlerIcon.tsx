// src/components/icons/FiddlerIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/fiddler.png?url';

export type FiddlerIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function FiddlerIcon({ className, alt, ...props }: FiddlerIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Fiddler icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default FiddlerIcon;
