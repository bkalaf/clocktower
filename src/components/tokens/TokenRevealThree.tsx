// src/components/tokens/TokenRevealThree.tsx

import { type ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TokenRevealThreeProps = {
    tokens: [ReactNode, ReactNode, ReactNode];
    className?: string;
};

function TokenRevealThree({ tokens, className }: TokenRevealThreeProps) {
    return (
        <Card
            className={cn(
                'w-full max-w-2xl space-y-4 rounded-2xl border border-border px-4 py-5 text-center shadow-sm shadow-card/30 sm:px-6',
                className
            )}
        >
            <div className='text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground'>
                THESE CHARACTERS ARE OUT OF PLAY:
            </div>

            <div className='flex flex-wrap items-center justify-center gap-3 text-sm font-semibold tracking-[0.4em] text-muted-foreground'>
                <div className='flex-1 min-w-[80px] flex justify-center'>{tokens[0]}</div>
                <span className='flex-none'>AND</span>
                <div className='flex-1 min-w-[80px] flex justify-center'>{tokens[1]}</div>
                <span className='flex-none'>AND</span>
                <div className='flex-1 min-w-[80px] flex justify-center'>{tokens[2]}</div>
            </div>
        </Card>
    );
}

export default TokenRevealThree;
