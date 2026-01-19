import { createFileRoute } from '@tanstack/react-router';
import { Settings, Sparkles, Clock3, ShieldCheck, Moon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { usePreferences } from '@/state/usePreferences';
import type { NightCardType } from '@/router/search';

const nightCardHighlights: { label: string; type: NightCardType }[] = [
    { label: 'You are evil', type: 'you_are_evil' },
    { label: 'Make a choice', type: 'make_a_choice' },
    { label: 'Use your ability', type: 'use_your_ability' }
];

const quickActions = [
    { label: 'Preferences', icon: Settings, action: 'preferences' },
    { label: 'Invites', icon: Sparkles, action: 'invites' },
    { label: 'Reveal', icon: ShieldCheck, action: 'reveal' }
] as const;

export const Route = createFileRoute('/')({
    component: DashboardRoute
});

function DashboardRoute() {
    const { open } = useModal();
    const { values } = usePreferences();

    const handleAction = (action: (typeof quickActions)[number]['action']) => {
        open(action);
    };

    return (
        <section className='flex flex-col gap-6'>
            <header className='space-y-2'>
                <p className='text-[11px] uppercase tracking-[0.6em] text-slate-400'>Clocktower Command</p>
                <h1 className='text-3xl font-semibold text-white sm:text-4xl'>Command Bridge</h1>
                <p className='max-w-2xl text-sm text-slate-300'>
                    Manage invites, night cards, and UI preference chips from the drawer and the chrome. The deck keeps
                    things compact by default and surfaces only the essentials until you open the modals you care about.
                </p>
            </header>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <article className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur'>
                    <div className='flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-slate-400'>
                        <Clock3 size={16} />
                        Quick actions
                    </div>
                    <div className='mt-3 flex flex-col gap-2'>
                        {quickActions.map((action) => (
                            <Button
                                key={action.label}
                                size='sm'
                                variant='outline'
                                className='flex items-center justify-between gap-3 rounded-2xl px-3 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                onClick={() => handleAction(action.action)}
                            >
                                <div className='flex items-center gap-2'>
                                    <action.icon size={14} />
                                    {action.label}
                                </div>
                                <span className='text-[10px] tracking-[0.4em] text-slate-500'>⌘</span>
                            </Button>
                        ))}
                    </div>
                </article>

                <article className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur'>
                    <div className='flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-slate-400'>
                        <Settings size={16} />
                        User Preferences
                    </div>
                    <div className='mt-3 space-y-2 text-[11px]'>
                        {Object.entries(values).map(([key, value]) => (
                            <div
                                key={key}
                                className='flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2'
                            >
                                <span className='text-slate-300'>{key}</span>
                                <span className='text-white'>{value}</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className='rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 backdrop-blur'>
                    <div className='flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-slate-400'>
                        <Moon size={16} />
                        Night Cards
                    </div>
                    <p className='mt-2 text-[11px] text-slate-400'>
                        Press a card to load it as a modal so the storyteller can prompt players without leaving the
                        current scene.
                    </p>
                    <div className='mt-3 flex flex-wrap gap-2'>
                        {nightCardHighlights.map((card) => (
                            <Button
                                key={card.type}
                                variant='outline'
                                size='sm'
                                className='rounded-2xl px-3 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                onClick={() => open('nightCards', { type: card.type })}
                            >
                                {card.label}
                            </Button>
                        ))}
                    </div>
                </article>
            </div>
        </section>
    );
}
