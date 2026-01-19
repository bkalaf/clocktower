// src/components/icons/InvestigatorIcon.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import iconSrc from '@/assets/icons/investigator.png?url';

export type InvestigatorIconProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function InvestigatorIcon({ className, alt, ...props }: InvestigatorIconProps) {
    return (
        <img
            {...props}
            src={iconSrc}
            alt={alt ?? 'Investigator icon'}
            className={cn('block h-full w-full object-contain', className)}
        />
    );
}

export default InvestigatorIcon;

