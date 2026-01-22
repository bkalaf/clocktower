// src/components/icons/LibrarianIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/librarian.png?url';

export type LibrarianIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function LibrarianIcon({ className, alt, ...props }: LibrarianIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Librarian icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default LibrarianIcon;
