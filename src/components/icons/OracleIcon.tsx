// src/components/icons/OracleIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/oracle.png?url';

export type OracleIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function OracleIcon({ className, alt, ...props }: OracleIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Oracle icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default OracleIcon;
