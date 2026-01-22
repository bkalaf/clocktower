// src/components/townsquare/TownSquareIntro.tsx
import * as React from 'react';

export function TownSquareIntro() {
    const [language] = React.useState(() => {
        if (typeof window === 'undefined') return 'en-US';
        return window.navigator.language ?? 'en-US';
    });

    return (
        <div className='relative w-full rounded-2xl border border-white/10 bg-black/60 p-5 text-[0.9rem] leading-relaxed text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.65)]'>
            <div className='mb-3 text-[0.65rem] uppercase tracking-[0.35em] text-slate-500'>
                Welcome to Virtual Town Square
            </div>
            <p className='text-[1rem]'>
                This unofficial virtual Grimoire and Town Square for Blood on the Clocktower lets you manage seats,
                roles, and vote flow inside a single scene. Add more players with the menu or press <strong>[A]</strong>{' '}
                to invite new participants. Use <strong>[J]</strong> to join a running session or <strong>[H]</strong>{' '}
                to host one.
            </p>
            <p className='mt-4 text-[0.65rem] uppercase tracking-[0.35em] text-emerald-300'>
                Open-source and community maintained
            </p>
            <p className='text-[0.65rem] text-slate-400'>
                The experience mirrors the Townsquare interface from{' '}
                <a
                    href='https://github.com/bra1n/townsquare'
                    target='_blank'
                    rel='noreferrer'
                    className='text-sky-300 underline'
                >
                    bra1n/townsquare
                </a>{' '}
                and uses the assets you provide.
            </p>
        </div>
    );
}
