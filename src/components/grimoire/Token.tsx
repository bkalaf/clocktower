// src/components/grimoire/Token.tsx
import { cn } from '@/lib/utils';
import tokenBase from '@/assets/images/token.png?url';
import * as React from 'react';

export type TokenBadge = {
    label: string;
    color?: 'red' | 'blue' | 'gray' | 'amber';
};

export type TokenProps = {
    name: string;
    image?: string;
    size?: number;
    badges?: TokenBadge[];
    className?: string;
    onClick?: () => void;
};

export function Token({ name, image, size = 130, badges = [], className, onClick }: TokenProps) {
    const bgImage = image || tokenBase;

    return (
        <button
            type='button'
            className={cn(
                'relative inline-flex flex-col items-center justify-center rounded-[50%] border-4 border-slate-900/80 bg-slate-950/70 p-2 text-center text-white shadow-[0_30px_60px_rgba(0,0,0,0.65)] transition hover:border-cyan-500/80 focus-visible:ring-[3px] focus-visible:ring-cyan-400/70 focus-visible:outline-none',
                className
            )}
            style={{
                width: size,
                height: size,
                backgroundImage:
                    'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 55%)'
            }}
            onClick={onClick}
        >
            <span
                className='absolute inset-2 rounded-[50%] border border-slate-900/60 bg-center bg-cover shadow-[inset_0_0_25px_rgba(0,0,0,0.7)]'
                style={{
                    backgroundImage: `url(${bgImage})`
                }}
            />
            <span className='pointer-events-none relative z-10 mt-auto font-cinzel text-[0.8rem] uppercase tracking-[0.25em] text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]'>
                {name}
            </span>
            {badges.length > 0 && (
                <div className='pointer-events-none absolute top-2 flex items-center gap-1'>
                    {badges.map((badge, index) => (
                        <span
                            key={`${badge.label}-${index}`}
                            className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full border text-[0.65rem] font-semibold uppercase',
                                {
                                    'border-red-500 bg-red-500/70 text-white': badge.color === 'red',
                                    'border-blue-500 bg-blue-500/70 text-white': badge.color === 'blue',
                                    'border-amber-400 bg-amber-400/70 text-white': badge.color === 'amber',
                                    'border-slate-500 bg-slate-500/40 text-white': badge.color === 'gray'
                                }
                            )}
                        >
                            {badge.label}
                        </span>
                    ))}
                </div>
            )}
        </button>
    );
}
