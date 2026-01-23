// src/test-entry.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import acrobatArt from '@/assets/tokens/acrobat.png?url';
import poisonerArt from '@/assets/tokens/poisoner.png?url';
import washerwomanArt from '@/assets/tokens/washerwoman.png?url';
import librarianArt from '@/assets/tokens/librarian.png?url';
import empathArt from '@/assets/tokens/empath.png?url';
import chefArt from '@/assets/tokens/chef.png?url';
import reminderDead from '@/assets/tokens/rt_dead.png?url';
import reminderPoisoned from '@/assets/tokens/rt_poisoned.png?url';
import reminderRight from '@/assets/tokens/rt_right.png?url';
import reminderWrong from '@/assets/tokens/rt_wrong.png?url';
import reverseArt from '@/assets/tokens/reverse.png?url';

type Alignment = 'good' | 'evil' | 'neutral';

const alignmentPalette: Record<Alignment, { border: string; banner: string; accent: string }> = {
    good: {
        border: '#38bdf8',
        banner: '#0ea5e9',
        accent: 'linear-gradient(180deg, rgba(14,165,233,0.5), rgba(14,165,233,0.05) 60%)'
    },
    evil: {
        border: '#f87171',
        banner: '#ef4444',
        accent: 'linear-gradient(180deg, rgba(248,113,113,0.55), rgba(248,113,113,0.05) 65%)'
    },
    neutral: {
        border: '#facc15',
        banner: '#eab308',
        accent: 'linear-gradient(180deg, rgba(250,204,21,0.55), rgba(250,204,21,0.05) 65%)'
    }
};

type CharacterTokenData = {
    role: string;
    art: string;
    ability: string;
    alignment: Alignment;
    desc: string;
};

const characterTokens: CharacterTokenData[] = [
    {
        role: 'Acrobat',
        art: acrobatArt,
        ability: 'Each night*, if either good living neighbour is drunk or poisoned, you die.',
        alignment: 'good',
        desc: 'Concentric arcs, starburst shimmer, and a soft white rim that mirrors the Acrobat frame.'
    },
    {
        role: 'Poisoner',
        art: poisonerArt,
        ability: 'Once per night, you can poison any living player without revealing yourself.',
        alignment: 'evil',
        desc: 'Diamond grid, neon-green trails, and a glass bevel glow that echoes the poison theme.'
    },
    {
        role: 'Washerwoman',
        art: washerwomanArt,
        ability: 'You start knowing that 1 of 2 players is a particular Townsfolk.',
        desc: '',
        alignment: 'good'
    },
    {
        role: 'Librarian',
        art: librarianArt,
        ability: 'You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)',
        desc: '',
        alignment: 'good'
    },
    {
        role: 'Empath',
        art: empathArt,
        ability: 'Each night, you learn how many of your 2 alive neighbours are evil.',
        desc: '',
        alignment: 'good'
    },
    {
        role: 'Chef',
        art: chefArt,
        ability: 'You start knowing how many pairs of evil players there are.',
        desc: '',
        alignment: 'good'
    }
];

const reminderVariants = [
    { role: 'Acrobat', status: 'Dead', icon: reminderDead, effect: 'dead' as const },
    { role: 'Poisoner', status: 'Poisoned', icon: reminderPoisoned, effect: 'poisoned' as const },
    { role: 'Washerwoman', status: 'Townsfolk', icon: reminderRight, effect: 'right' as const },
    { role: 'Washerwoman', status: 'Wrong', icon: reminderWrong, effect: 'wrong' as const },
    { role: 'Investigator', status: 'Minion', icon: reminderRight, effect: 'right' as const },
    { role: 'Investigator', status: 'Wrong', icon: reminderWrong, effect: 'wrong' as const },
    { role: 'Librarian', status: 'Outsider', icon: reminderRight, effect: 'right' as const },
    { role: 'Librarian', status: 'Wrong', icon: reminderWrong, effect: 'wrong' as const }
];

type ReminderEffect = (typeof reminderVariants)[number]['effect'];

const reminderEffectPalette: Record<ReminderEffect, string> = {
    dead: '#ef4444',
    poisoned: '#22c55e',
    right: '#22c55e',
    wrong: '#ef4444'
};

function CharacterToken({ data }: { data: CharacterTokenData }) {
    const [flipped, setFlipped] = React.useState(false);
    const palette = alignmentPalette[data.alignment];

    const innerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        willChange: 'transform'
    };

    const faceStyle: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        borderRadius: '1.85rem',
        border: '4px solid',
        borderColor: palette.border,
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        backfaceVisibility: 'hidden'
    };

    return (
        <article className='flex flex-col items-center gap-3'>
            <div
                className='relative h-[198px] w-[198px]'
                style={{ perspective: '1500px' }}
                onMouseEnter={() => setFlipped(true)}
                onMouseLeave={() => setFlipped(false)}
            >
                <div
                    className='absolute inset-0 rounded-[1.85rem]'
                    style={innerStyle}
                >
                    <div
                        className='absolute inset-0 overflow-hidden'
                        style={{
                            ...faceStyle,
                            backgroundColor: '#04070c'
                        }}
                    >
                        <div
                            className='absolute inset-0'
                            style={{
                                backgroundImage: `url(${data.art})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/90' />
                    </div>
                    <div
                        className='absolute inset-0 h-full w-full overflow-hidden'
                        style={{
                            ...faceStyle,
                            transform: 'rotateY(180deg)',
                            backgroundColor: '#05070f'
                        }}
                    >
                        <div
                            className='absolute inset-0'
                            style={{
                                backgroundImage: `url(${reverseArt})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                        <div className='absolute inset-0 rounded-[1.85rem] bg-black/60 backdrop-blur-md' />
                        <div className='relative flex h-full w-full flex-col items-center justify-center gap-2 px-5 text-center'>
                            <p
                                className='text-[0.65rem] uppercase tracking-[0.4em]'
                                style={{ color: '#fcd34d', letterSpacing: '0.3em' }}
                            >
                                Ability
                            </p>
                            <p
                                className='text-[0.78rem] leading-relaxed'
                                style={{
                                    color: '#f8fafc',
                                    letterSpacing: '0.04em',
                                    fontFamily: '"Rowdies", "Rubik", system-ui, sans-serif'
                                }}
                            >
                                {data.ability}
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className='absolute left-1/2 flex translate-x-[-50%] items-center justify-center rounded-full px-5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
                    style={{
                        bottom: '-0.65rem',
                        backgroundColor: palette.banner
                    }}
                >
                    {data.role}
                </div>
            </div>
        </article>
    );
}

function ReminderIconToken({
    role,
    status,
    icon,
    effect
}: {
    role: string;
    status: string;
    icon: string;
    effect: ReminderEffect;
}) {
    const topTheme = {
        background: 'rgba(255,255,255,0.08)',
        color: '#f8fafc'
    };

    return (
        <div className='relative flex items-center justify-center'>
            <div
                className='absolute left-1/2 flex min-w-[110px] items-center justify-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em]'
                style={{
                    top: 0,
                    transform: 'translate(-50%, -50%)',
                    background: topTheme.background,
                    color: topTheme.color,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.45)'
                }}
            >
                {role.toUpperCase()}
            </div>
            <div className='relative h-14 w-14 overflow-hidden rounded-[1.35rem] border border-white/15 bg-slate-900/70 shadow-[0_14px_32px_rgba(0,0,0,0.75)]'>
                <img
                    src={icon}
                    alt={`${role} reminder icon`}
                    className='h-full w-full object-cover'
                />
            </div>
            <div
                className='absolute left-1/2 flex min-w-[110px] items-center justify-center rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.35em] text-white'
                style={{
                    bottom: 0,
                    transform: 'translate(-50%, 50%)',
                    background: reminderEffectPalette[effect],
                    boxShadow: '0 8px 18px rgba(0,0,0,0.55)'
                }}
            >
                {status.toUpperCase()}
            </div>
        </div>
    );
}

const TokenGallery: React.FC = () => {
    return (
        <div className='space-y-10'>
            <header className='space-y-3'>
                <h1 className='text-4xl font-[Cinzel] uppercase tracking-[0.35em] text-white'>Acrobat Token Lab</h1>
                <p className='text-sm uppercase tracking-[0.5em] text-slate-300'>
                    Testing the shared token + reminder primitives outside of the main shell.
                </p>
            </header>

            <section className='grid gap-8 rounded-[1.75rem] border border-white/15 bg-slate-900/40 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]'>
                <div className='flex flex-col gap-6'>
                    <h2 className='text-lg font-semibold uppercase tracking-[0.3em] text-slate-100'>Token Preview</h2>
                    <div className='flex flex-wrap items-start gap-8'>
                        {characterTokens.map((entry) => (
                            <CharacterToken
                                key={entry.role}
                                data={entry}
                            />
                        ))}
                    </div>
                </div>

                <div className='flex flex-col gap-6'>
                    <div>
                        <h2 className='text-lg font-semibold uppercase tracking-[0.3em] text-slate-100'>
                            Reminder Variants
                        </h2>
                        <p className='mt-1 text-xs uppercase tracking-[0.4em] text-slate-400'>
                            Icon-first, role-aware banners
                        </p>
                    </div>
                    <div className='grid auto-rows-auto gap-4 sm:grid-cols-2'>
                        {reminderVariants.map((variant) => (
                            <ReminderIconToken
                                key={`${variant.role}-${variant.status}`}
                                role={variant.role}
                                status={variant.status}
                                icon={variant.icon}
                                effect={variant.effect}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className='rounded-[1.5rem] border border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 shadow-[0_25px_55px_rgba(15,15,30,0.95)]'>
                <div className='flex flex-col gap-3'>
                    <span className='text-xs uppercase tracking-[0.4em] text-slate-300'>Token Details</span>
                    <p className='text-sm text-white/80'>
                        Square tokens show high-detail artwork at 100px resolution, an alignment-tinted border, and a
                        hero banner for the role. Hovering flips the piece to reveal the ability copy on a gold-on-black
                        reverse surface that reuses the reverse.png art and stretches edge-to-edge.
                    </p>
                </div>
                <dl className='mt-6 grid gap-4 sm:grid-cols-3'>
                    {[
                        { label: 'Shape', value: 'Rounded Square' },
                        { label: 'Borders', value: 'Alignment Hue' },
                        { label: 'Reminders', value: 'Icon + Banners' }
                    ].map((item) => (
                        <div
                            key={item.label}
                            className='rounded-2xl border border-white/20 bg-white/5 p-4 text-center uppercase tracking-[0.35em] text-xs text-slate-200'
                        >
                            <dt className='text-[0.55rem] text-slate-400'>{item.label}</dt>
                            <dd className='mt-2 text-lg font-semibold text-white'>{item.value}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </div>
    );
};

const rootElement = document.getElementById('token-lab-root');

if (rootElement) {
    createRoot(rootElement).render(<TokenGallery />);
} else {
    console.error('Unable to mount token lab root');
}
