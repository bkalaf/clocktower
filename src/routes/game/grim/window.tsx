// src/routes/game/grim/window.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';
import { whoamiFn } from '@/lib/api';
import type { AuthedUser } from '@/types/game';

export const Route = createFileRoute('/game/grim/window')({
    loader: async () => {
        const { user } = await whoamiFn();
        if (!user) {
            redirect({ to: '/login' });
        }
        return { user };
    },
    component: GameGrimWindow
});

function GameGrimWindow() {
    const { user } = Route.useLoaderData<typeof Route.loader>();
    const displayName = user.displayName ?? user.username;

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-10 text-white'>
            <div className='w-full max-w-3xl space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-black/60'>
                <header className='space-y-1'>
                    <p className='text-xs uppercase tracking-[0.4em] text-slate-400'>Game / Grim</p>
                    <h1 className='text-3xl font-semibold text-white'>Grimoire Snapshot</h1>
                    <p className='text-sm text-slate-400'>Serving {displayName}</p>
                </header>
                <div className='rounded-2xl border border-dashed border-white/20 bg-slate-950/60 p-6 text-sm text-slate-200'>
                    <p>This window is intended to request the grimoire/screenshot data directly from the server.</p>
                    <p>The server enforces that only an authorized Spy receives that data, so this route remains safe even if someone tries to open it manually.</p>
                    <p className='text-xs uppercase tracking-[0.4em] text-slate-500'>Popup only / no viewport mutation</p>
                </div>
                <div className='flex justify-end'>
                    <button
                        type='button'
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.close();
                            }
                        }}
                        className='rounded-full border border-white/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/50'
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
