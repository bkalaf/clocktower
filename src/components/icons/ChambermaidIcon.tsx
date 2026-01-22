// src/components/icons/ChambermaidIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/chambermaid.png?url';

export type ChambermaidIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function ChambermaidIcon({ className, alt, ...props }: ChambermaidIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Chambermaid icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default ChambermaidIcon;
