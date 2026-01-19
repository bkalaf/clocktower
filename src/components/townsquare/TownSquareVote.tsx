// src/components/townsquare/TownSquareVote.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useTownSquare } from '@/state/TownSquareContext';
import { VoteYea } from 'lucide-react';

export function TownSquareVote() {
    const { players, session, actions } = useTownSquare();
    const nominator = players[session.nomination[0]] ?? players[0];
    const nominee = players[session.nomination[1]] ?? players[1];
    const alive = players.filter((player) => !player.isDead).length;
    const majority = Math.ceil(alive / 2);
    const votes = session.votes.filter(Boolean).length;

    const handleVote = (vote: boolean) => {
        const playerIndex = players.findIndex((player) => player.id === session.playerId);
        if (playerIndex >= 0) {
            actions.vote(playerIndex, vote);
        }
    };

    return (
        <div className='rounded-3xl border border-white/10 bg-black/70 px-4 py-5 text-[0.75rem] uppercase tracking-[0.3em] text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)]'>
            <div className='flex items-center justify-between text-[0.65rem] text-slate-400'>
                <span>Vote Panel</span>
                <span>{session.isVoteInProgress ? 'In Progress' : 'Idle'}</span>
            </div>
            <div className='mt-3 grid grid-cols-2 gap-4'>
                <div className='space-y-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-center'>
                    <span className='text-[0.6rem] text-slate-400'>Nominator</span>
                    <p className='text-sm font-semibold uppercase tracking-[0.2em]'>{nominator?.name ?? '—'}</p>
                </div>
                <div className='space-y-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-center'>
                    <span className='text-[0.6rem] text-slate-400'>Nominee</span>
                    <p className='text-sm font-semibold uppercase tracking-[0.2em]'>{nominee?.name ?? '—'}</p>
                </div>
            </div>
            <div className='mt-4 flex items-center justify-between'>
                <span className='flex items-center gap-1 text-[0.65rem] text-slate-400'>
                    <VoteYea className='h-4 w-4 text-emerald-300' />
                    Votes in favor
                </span>
                <span className='text-white'>{votes}</span>
            </div>
            <div className='mt-2 flex items-center justify-between text-[0.65rem] text-slate-400'>
                <span>Majority</span>
                <span>{session.nomination[1] >= 0 ? majority : '—'}</span>
            </div>
            <div className='mt-4 flex flex-wrap gap-2'>
                {!session.isVoteInProgress && (
                    <>
                        <Button variant='outline' size='sm' onClick={() => actions.lockVote(0)}>
                            Countdown
                        </Button>
                        <Button variant='outline' size='sm' onClick={() => actions.setVoteInProgress(true)}>
                            Start Vote
                        </Button>
                    </>
                )}
                {session.isVoteInProgress && (
                    <>
                        <Button variant='outline' size='sm' onClick={() => actions.lockVote()}>
                            Lock Next
                        </Button>
                        <Button variant='outline' size='sm' onClick={() => actions.setVoteInProgress(false)}>
                            Pause
                        </Button>
                        <Button variant='ghost' size='sm' onClick={() => actions.setVoteInProgress(false)}>
                            Reset
                        </Button>
                    </>
                )}
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                        if (!nominator || !nominee) return;
                        const entry = {
                            timestamp: Date.now(),
                            nominator: nominator.name,
                            nominee: nominee.name,
                            type: 'execution',
                            majority,
                            votes: players
                                .filter((player, index) => session.votes[index])
                                .map((player) => player.name)
                        };
                        actions.addHistory(entry);
                        actions.setVoteInProgress(false);
                        actions.lockVote(0);
                    }}
                >
                    Finish
                </Button>
            </div>
            <div className='mt-3 flex items-center justify-between text-[0.65rem] text-slate-400'>
                <span>Hand gestures</span>
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => handleVote(false)}>
                        Hand DOWN
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => handleVote(true)}>
                        Hand UP
                    </Button>
                </div>
            </div>
        </div>
    );
}
