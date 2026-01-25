// src/components/TopBar.tsx
import { useCallback } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ChevronDown, LogIn, LogOut, Settings, User, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useModal } from '@/hooks/useModal';

import { InvitesButton } from './header/InvitesButton';
import { TopBarMobileMenu } from './top-bar/TopBarMobileMenu';
import { TopBarScriptsMenu } from './top-bar/TopBarScriptsMenu';
import { TopBarSidebarTrigger } from './TopBarSidebarTrigger';
import { UserNameSpan } from './UserNameSpan';
import { useAppSelector } from '../client/state/hooks';
import { authSelectors } from '../client/state/authSlice';
import { CreateRoomButton } from './CreateRoomButton';



export function TopBar() {
    const navigate = useNavigate();
    const { open } = useModal();
    const isAuth = useAppSelector(authSelectors.isAuth);
    const username = useAppSelector(authSelectors.selectUsername);
    console.log(`isAuth`, isAuth);
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]'
                                    >
                                        <Avatar className='h-7 w-7 border border-white/10 bg-slate-900 shadow-black/50'>
                                            <AvatarFallback>
                                                <User size={16} />
                                            </AvatarFallback>
                                        </Avatar>
                                        <ChevronDown size={14} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align='end'
                                    className='min-w-[200px] rounded-2xl border border-white/10 bg-slate-900/90 p-2 text-xs'
                                >
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
                            <UserNameSpan username={username} />
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
