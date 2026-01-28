// src/components/TopBar.tsx
import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookOpen, ChevronDown, LogIn, LogOut, PanelRightClose, PanelRightOpen, Settings, User, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useModal } from '@/hooks/useModal';

import { InvitesButton } from './header/InvitesButton';
import { TopBarMobileMenu } from './top-bar/TopBarMobileMenu';
import { TopBarScriptsMenu } from './top-bar/TopBarScriptsMenu';
import { TopBarSidebarTrigger } from './TopBarSidebarTrigger';
import { UserNameSpan } from './UserNameSpan';
import { CreateRoomButton } from './CreateRoomButton';
import {
    useIsAuth,
    useUsername,
    useAvatarUrl,
    useDisplayName,
    useUserLevel,
    useUserCurrentXP,
    useUserRequiredXP
} from '../client/state/useIsAuth';
import { useRightSidebar } from '@/components/ui/sidebar-right';
import { useRoomUi } from '@/components/room/RoomUiContext';

export function TopBar() {
    const navigate = useNavigate();
    const { open } = useModal();
    const isAuth = useIsAuth();
    const username = useUsername();
    const avatarUrl = useAvatarUrl();
    const displayName = useDisplayName();
    const userLevel = useUserLevel();
    const currentXP = useUserCurrentXP();
    const requiredXP = useUserRequiredXP();
    const { roomId, toggleSettings, toggleNotes } = useRoomUi();
    const { open: rightSidebarOpen, toggleRightSidebar } = useRightSidebar();
    const rightSidebarLabel = rightSidebarOpen ? 'Close right sidebar' : 'Open right sidebar';
    const RightSidebarIcon = rightSidebarOpen ? PanelRightClose : PanelRightOpen;
    const fallbackInitials = useMemo(() => {
        const source = (displayName ?? username ?? '').trim();
        if (!source) return null;
        const initials = source
            .split(/\s+/)
            .map((part) => part.charAt(0))
            .filter(Boolean)
            .slice(0, 2)
            .join('');
        return initials.toUpperCase();
    }, [displayName, username]);
    const xpStats = useMemo(() => {
        const safeCurrent = Math.max(0, currentXP ?? 0);
        const safeRequired = Math.max(0, requiredXP ?? 0);
        const percent =
            safeRequired > 0 ? Math.min(100, Math.round((safeCurrent / safeRequired) * 100)) : 0;
        const remaining = Math.max(0, safeRequired - safeCurrent);
        const hasLevel = Number.isFinite(userLevel);
        const nextLevel = hasLevel ? Math.max(0, Math.floor(userLevel)) + 1 : undefined;
        const targetLabel = nextLevel ? `to level ${nextLevel}` : 'to next level';
        return {
            xpPercent: percent,
            xpLabel: `${safeCurrent}/${safeRequired}`,
            xpSubLabel: `${remaining} XP ${targetLabel}`,
            xpIndicatorClass: percent >= 90 ? 'bg-lime-400' : 'bg-amber-400'
        };
    }, [currentXP, requiredXP, userLevel]);
    const { xpPercent, xpLabel, xpSubLabel, xpIndicatorClass } = xpStats;
    const showLevelBadge = isAuth && Number.isFinite(userLevel);
    const badgeLevel = Math.max(0, Math.floor(userLevel));
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

    const handlePreferences = useCallback(() => {
        open('preferences');
    }, [open]);

    // const handleLogout = useCallback(() => {
    //     void logoutAndClear();
    // }, [logoutAndClear]);

    return (
        <header className='sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 text-white backdrop-blur-lg'>
            <div className='mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4'>
                <div className='flex items-center gap-3'>
                    <TopBarSidebarTrigger isAuth={isAuth} />
                    <div className='hidden items-center gap-2 md:flex'>
                        <CreateRoomButton />
                        {isAuth && (
                            <Button
                                variant='ghost'
                                size='sm'
                                className='uppercase tracking-[0.3em]'
                                asChild
                            >
                                {/* <Link to='/setup'>Game / Setup</Link> */}
                                <Link to='/'>Game / Setup</Link>
                            </Button>
                        )}
                    </div>
                    <div className='flex items-center gap-2 md:hidden'>
                        <TopBarMobileMenu />
                        <Button
                            variant='ghost'
                            size='sm'
                            className='uppercase tracking-[0.3em]'
                            asChild
                        >
                            {/* <Link to='/setup'>Game / Setup</Link> */}
                            <Link to='/'>Game / Setup</Link>
                        </Button>
                        <Link
                            to='/'
                            className='text-xs font-semibold uppercase tracking-[0.4em] text-slate-300'
                        >
                            Clocktower
                        </Link>
                    </div>
                </div>

                {isAuth && (
                    <div className='hidden items-center gap-3 md:flex'>
                        <TopBarScriptsMenu />
                        <InvitesButton />
                    </div>
                )}

                {roomId && (
                    <div className='hidden items-center gap-2 md:flex'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={toggleSettings}
                            aria-label='Room settings'
                        >
                            <Settings className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={toggleNotes}
                            aria-label='Room notes'
                        >
                            <BookOpen className='h-4 w-4' />
                        </Button>
                    </div>
                )}

                <div className='flex items-center gap-2'>
                    {isAuth && (
                        <span className='text-[11px] uppercase tracking-[0.3em] text-slate-400'>Checking session…</span>
                    )}
                    {!isAuth && (
                        <>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                onClick={handleLogin}
                            >
                                <LogIn size={14} />
                                Sign in
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                className='flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                onClick={handleRegister}
                            >
                                <UserPlus size={14} />
                                Sign up
                            </Button>
                        </>
                    )}
                    {isAuth && (
                        <>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={handlePreferences}
                                aria-label='Open preferences'
                            >
                                <Settings className='h-4 w-4' />
                            </Button>

                            <div className='flex items-center gap-1'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                >
                                    <div className='relative'>
                                        <Avatar className='h-7 w-7 border border-white/10 bg-slate-900 shadow-black/50'>
                                            {avatarUrl ? (
                                                <AvatarImage src={avatarUrl} alt={displayName ?? username ?? 'Avatar'} />
                                            ) : (
                                                <AvatarFallback className='text-[11px] font-semibold uppercase tracking-[0.3em]'>
                                                    {fallbackInitials ?? <User size={16} />}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        {showLevelBadge && (
                                            <span className='absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/30 bg-zinc-900 text-[10px] font-bold tabular-nums text-zinc-100 shadow-black/80'>
                                                {badgeLevel}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown size={14} />
                                </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='end'
                                        className='min-w-[200px] rounded-2xl border border-white/10 bg-slate-900/90 p-2 text-xs'
                                    >
                                        <div className='space-y-1 border-b border-white/10 px-3 pb-3'>
                                            <div className='flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-slate-400'>
                                                <span>XP</span>
                                                <span className='text-xs font-semibold text-white'>{xpPercent}%</span>
                                            </div>
                                            <Progress
                                                value={xpPercent}
                                                className='h-2 rounded-full bg-white/10'
                                                indicatorClassName={xpIndicatorClass}
                                            />
                                            <p className='text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400'>
                                                {xpLabel} • {xpSubLabel}
                                            </p>
                                        </div>
                                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                                        {/* <DropdownMenuItem asChild>
                                            <Link to='/profile'>Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to='/stats'>User stats</Link>
                                        </DropdownMenuItem> */}
                                        <DropdownMenuItem onSelect={handlePreferences}>Preferences</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            variant='destructive'
                                            onSelect={() => {}}
                                        >
                                            <LogOut size={14} />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {roomId && (
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={toggleRightSidebar}
                                        aria-label={rightSidebarLabel}
                                    >
                                        <RightSidebarIcon className='h-4 w-4' />
                                    </Button>
                                )}
                            </div>
                            <UserNameSpan username={username} />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
