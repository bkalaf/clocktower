// src/components/tokens/TokenRevealTwo.tsx

import { type ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TokenRevealTwoProps = {
    leftToken: ReactNode;
    rightToken: ReactNode;
    className?: string;
};

function TokenRevealTwo({ leftToken, rightToken, className }: TokenRevealTwoProps) {
    return (
        <Card
            className={cn(
                'w-full max-w-md space-y-4 rounded-2xl border border-border px-4 py-5 text-center shadow-sm shadow-card/30 sm:px-6',
                className
            )}
        >
            <div className='text-xs font-semibold uppercase tracking-[0.45em] text-muted-foreground'>
                YOU SEE:
            </div>

            <div className='flex items-center justify-between gap-4'>
                <div className='flex-1 flex items-center justify-center'>
                    {leftToken}
                </div>

                <span className='flex-none text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground'>
                    OR
                </span>

                <div className='flex-1 flex items-center justify-center'>
                    {rightToken}
                </div>
            </div>
        </Card>
    );
}

export default TokenRevealTwo;
