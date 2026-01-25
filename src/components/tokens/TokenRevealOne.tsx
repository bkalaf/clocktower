// src/components/tokens/TokenRevealOne.tsx

import { type ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TokenRevealOneProps = {
    token: ReactNode;
    className?: string;
};

function TokenRevealOne({ token, className }: TokenRevealOneProps) {
    return (
        <Card
            className={cn(
                'w-full max-w-xs space-y-4 rounded-2xl border border-border px-4 py-5 text-center shadow-sm shadow-card/30 sm:px-5',
                className
            )}
        >
            <div className='text-xs font-semibold uppercase tracking-[0.45em] text-muted-foreground'>
                YOU SEE:
            </div>

            <div className='flex justify-center'>{token}</div>
        </Card>
    );
}

export default TokenRevealOne;
