// src/components/icons/JudgeIcon.tsx

import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/judge.png?url';

export type JudgeIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function JudgeIcon({ className, alt, ...props }: JudgeIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Judge icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default JudgeIcon;
