// src/routes/_authed.rooms._room.$roomId._st.window.tsx
import { createFileRoute } from '@tanstack/react-router';
import { loadPrivilegedUser } from '@/routes/_authed/-privilegedLoader';
import type { AuthedUser } from '@/types/game';
export const Route = createFileRoute('/_authed/rooms/_room/$roomId/_st/window')({
    loader: async () => {
        const user = await loadPrivilegedUser();
        return { user };
    },
    component: StorytellerReviewWindow
});

function StorytellerReviewWindow() {
    const { roomId } = Route.useParams();
    const { user } = Route.useLoaderData<typeof Route.loader>();
    const displayName = user.displayName ?? user.username;

    return (
        <div className='flex min-h-screen flex-col bg-slate-950 px-6 py-10 text-white'>
            <div className='mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-black/70'>
                <header className='flex flex-col gap-3'>
                    <p className='text-xs uppercase tracking-[0.4em] text-slate-400'>Storyteller Review</p>
                    <h1 className='text-3xl font-semibold tracking-[0.08em] text-white/90'>Storyteller Screenshot</h1>
                    <p className='text-sm text-slate-400'>Room {roomId ?? 'unknown'}</p>
                    <p className='text-sm text-slate-400'>Initialized for {displayName}</p>
                </header>
                <div className='flex flex-col gap-2 rounded-2xl border border-dashed border-white/20 bg-slate-950/60 p-6 text-sm text-slate-200'>
                    <p>
                        This window is intentionally minimal so the main viewport stays untouched. Replace this
                        placeholder with the storyteller screenshot / grimoire UI once the rendering endpoint is
                        wired up.
                    </p>
                    <p className='text-xs uppercase tracking-[0.4em] text-slate-500'>
                        Authorization enforced via /api/auth/me/mod.
                    </p>
                </div>
                <div className='flex justify-end gap-3 pt-4'>
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
