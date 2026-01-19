// src/routes/games/$gameId.tsx
import { useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { useAuth } from '@/state/useAuth';
import { useRoomGame } from '@/state/useRoomGame';

export const Route = createFileRoute('/games/$gameId')({
    component: GameRoute
});

function GameRoute() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { gameId } = Route.useParams();
    const { roomState, matchState, loading, error } = useRoomGame(gameId);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate({ to: '/login', replace: true });
        }
    }, [authLoading, user, navigate]);

    if (!user) {
        return (
            <main className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-400'>Redirecting to login…</p>
            </main>
        );
    }

    if (!gameId) {
        return (
            <main className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-400'>No game selected</p>
            </main>
        );
    }

    if (loading) {
        return (
            <main className='min-h-screen flex items-center justify-center'>
                <p className='text-gray-400'>Loading room…</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className='min-h-screen flex items-center justify-center'>
                <p className='text-red-400'>Error loading room: {error}</p>
            </main>
        );
    }

    const readyCount = roomState.connectedUserIds.filter((id) => roomState.readyByUserId[id]).length;
    const totalConnected = roomState.connectedUserIds.length;

    return (
        <main className='min-h-screen bg-slate-950 text-white'>
            <section className='max-w-6xl mx-auto px-6 py-10 space-y-6'>
                <header className='flex flex-col gap-2'>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>Game room</p>
                    <h1 className='text-3xl font-semibold flex items-baseline gap-2'>
                        {roomState.room?.scriptId ?? 'Unnamed script'}
                        <span className='text-sm text-slate-400'>#{roomState.roomId ?? gameId}</span>
                    </h1>
                    <p className='text-sm text-slate-300'>
                        {roomState.status} · hosted by {roomState.hostUserId ?? 'unknown'}
                    </p>
                </header>

                <div className='grid gap-6 lg:grid-cols-2'>
                    <article className='rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3'>
                        <h2 className='text-lg font-semibold text-white'>Room snapshot</h2>
                        <p className='text-sm text-slate-300'>
                            Visibility: {roomState.visibility} · Storyteller count: {roomState.storytellerCount}
                        </p>
                        <p className='text-sm text-slate-300'>
                            Travelers: {roomState.allowTravelers ? 'enabled' : 'disabled'}
                        </p>
                        <p className='text-sm text-slate-300'>
                            Connected players: {totalConnected} · Ready: {readyCount}
                        </p>
                        <div className='flex flex-wrap gap-2 text-xs text-slate-300'>
                            {roomState.connectedUserIds.map((id) => (
                                <span
                                    key={id}
                                    className='rounded-full border border-white/10 px-3 py-1 text-xs'
                                >
                                    {id}
                                    {roomState.readyByUserId[id] ? ' (ready)' : ''}
                                </span>
                            ))}
                        </div>
                    </article>

                    <article className='rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3'>
                        <h2 className='text-lg font-semibold text-white'>Match status</h2>
                        <p className='text-sm text-slate-300'>Match ID: {matchState.matchId ?? 'waiting'}</p>
                        <p className='text-sm text-slate-300'>
                            Phase: {matchState.phase} → {matchState.subphase}
                        </p>
                        <p className='text-sm text-slate-300'>
                            Day: {matchState.dayNumber} · Status: {matchState.matchStatus}
                        </p>
                        <p className='text-sm text-slate-300'>Votes stored: {matchState.voteHistory.length}</p>
                        <p className='text-sm text-slate-300'>
                            Travelers admitted: {matchState.travelerUserIds.length}
                        </p>
                    </article>
                </div>

                <article className='rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3'>
                    <h2 className='text-lg font-semibold text-white'>Match log</h2>
                    {matchState.voteHistory.length === 0 ?
                        <p className='text-sm text-slate-300'>No nominations recorded yet.</p>
                    :   <ul className='space-y-2 text-sm text-slate-200'>
                            {matchState.voteHistory.slice(-5).map((entry) => (
                                <li
                                    key={`${entry.day}-${entry.nomineeId}-${entry.ts}`}
                                    className='rounded-xl bg-slate-900/50 p-3 border border-white/5'
                                >
                                    Day {entry.day}: {entry.nominationType} {entry.nomineeId} ({entry.votesFor}/
                                    {entry.threshold})
                                </li>
                            ))}
                        </ul>
                    }
                </article>
            </section>
        </main>
    );
}
