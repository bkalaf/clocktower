// src/components/header/TopBar.tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { ChevronDown, Settings, LogIn, LogOut, Menu, Moon, Sparkles, User, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InvitesButton } from './InvitesButton';
import { usePreferences } from '@/hooks/usePreferences';
import type { AuthedUser } from '@/types/game';
import { useModal } from '../../hooks/useModal';

export type TopBarProps = {
    user?: AuthedUser | null;
    isAuthLoading: boolean;
    onMenuOpen: () => void;
    onLogout: () => void;
};

const nightCardOptions: { label: string; type: NightCardType }[] = [
    { label: 'You are evil', type: 'you_are_evil' },
    { label: 'You are good', type: 'you_are_good' },
    { label: 'Make a choice', type: 'make_a_choice' },
    { label: 'Use your ability', type: 'use_your_ability' },
    { label: 'These characters are out of play', type: 'these_characters_are_out_of_play' },
    { label: 'These are your minions', type: 'these_are_your_minions' },
    { label: 'This is the demon', type: 'this_is_the_demon' },
    { label: 'You are…', type: 'you_are' }
];

const densitySpacing: Record<string, string> = {
    compact: 'gap-2 py-2',
    balanced: 'gap-2.5 py-2.5',
    airy: 'gap-3 py-3'
};

const toneClasses: Record<string, string> = {
    soft: 'bg-slate-950/70 border-b border-white/10 shadow-inner shadow-cyan-500/10',
    outline: 'bg-slate-950/85 border-b border-white/15',
    flat: 'bg-slate-950/70 border-b border-white/5'
};

export function TopBar({ user, isAuthLoading, onMenuOpen, onLogout }: TopBarProps) {
    const navigate = useNavigate();
    const { open } = useModal();
    const { values } = usePreferences();

    const spacingClass = densitySpacing[values.density] ?? densitySpacing.compact;
    const toneClass = toneClasses[values.panelTone] ?? toneClasses.soft;

    const handleLogin = useCallback(() => {
        navigate({
            to: '/login'
        });
    }, [navigate]);

    const handleRegister = useCallback(() => {
        navigate({
            to: '/register'
        });
    }, [navigate]);

    const renderNightCardItem = useCallback(
        (option: { label: string; type: NightCardType }) => (
            <DropdownMenu.Item
                key={option.type}
                className='flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-100 hover:bg-white/5 focus:bg-white/5'
                onSelect={() => open('nightCards', { type: option.type })}
            >
                <Moon
                    size={14}
                    className='text-slate-300'
                />
                {option.label}
            </DropdownMenu.Item>
        ),
        [open]
    );

    return (
        <header
            className={`sticky top-0 z-20 flex w-full items-center justify-between px-4 text-white backdrop-blur-sm ${spacingClass} ${toneClass}`}
        >
            <div className='flex items-center gap-2'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={onMenuOpen}
                    aria-label='Open navigation drawer'
                >
                    <Menu size={18} />
                </Button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <Button
                            variant='outline'
                            size='sm'
                            className='flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4em]'
                        >
                            <Sparkles size={14} />
                            Actions
                            <ChevronDown size={14} />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className='z-50 min-w-[220px] space-y-1 rounded-2xl border border-white/10 bg-slate-900/95 p-2 text-xs shadow-lg shadow-black/50'>
                        <DropdownMenu.Item
                            className='flex items-center gap-2 rounded-xl px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-100 hover:bg-white/5 focus:bg-white/5'
                            onSelect={() => open('reveal')}
                        >
                            <Sparkles
                                size={14}
                                className='text-slate-300'
                            />
                            Reveal
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className='my-1 h-px bg-white/5' />
                        <span className='px-3 text-[10px] uppercase tracking-[0.6em] text-slate-500'>Night Cards</span>
                        {nightCardOptions.map((option) => renderNightCardItem(option))}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Link
                    to='/'
                    className='ml-3 flex flex-col leading-tight text-white'
                >
                    <span className='text-xs uppercase tracking-[0.4em] text-slate-400'>Clocktower</span>
                    <span className='text-base font-semibold'>Command Deck</span>
                </Link>
            </div>
            <div className='flex items-center gap-2'>
                <InvitesButton />
                <div className='flex items-center gap-2'>
                    {!user && isAuthLoading && <span className='text-[11px] text-slate-300'>Checking session…</span>}
                    {!user && !isAuthLoading && (
                        <>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                onClick={handleLogin}
                            >
                                <LogIn size={14} />
                                Login
                            </Button>
                            <Button
                                variant='default'
                                size='sm'
                                className='flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                onClick={handleRegister}
                            >
                                <UserPlus size={14} />
                                Register
                            </Button>
                        </>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={() => open('preferences')}
                                aria-label='Open preferences'
                            >
                                <Settings size={16} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>Open UI preferences</TooltipContent>
                    </Tooltip>
                    {user && (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                >
                                    <Avatar className='h-6 w-6 border border-white/10 bg-slate-900 shadow-inner shadow-black/60'>
                                        <AvatarFallback>
                                            <User size={16} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{user.name}</span>
                                    <ChevronDown size={14} />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content className='z-50 min-w-[180px] rounded-2xl border border-white/10 bg-slate-900/90 p-2 text-[11px]'>
                                <DropdownMenu.Item
                                    className='flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-white uppercase tracking-[0.2em] hover:bg-white/5 focus:bg-white/5'
                                    onSelect={onLogout}
                                >
                                    <LogOut size={14} />
                                    Logout
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    )}
                </div>
            </div>
        </header>
    );
}
