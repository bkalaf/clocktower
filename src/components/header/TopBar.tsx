// src/components/header/TopBar.tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { LogIn, Menu, User, UserPlus, ChevronDown, LogOut } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AuthedUser } from '../../types/game';
import { ScriptMenu } from './ScriptMenu';
import { InvitesButton } from './InvitesButton';

export type TopBarProps = {
    user?: AuthedUser | null;
    isAuthLoading: boolean;
    onMenuOpen: () => void;
    onLogout: () => void;
};

export function TopBar({ user, isAuthLoading, onMenuOpen, onLogout }: TopBarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentLocation = location.current;
    const returnTo = `${currentLocation?.pathname ?? '/'}${currentLocation?.search ?? ''}`;

    const handleLogin = useCallback(() => {
        navigate({
            to: '/login',
            search: { returnTo }
        });
    }, [navigate, returnTo]);

    const handleRegister = useCallback(() => {
        navigate({
            to: '/register',
            search: { returnTo }
        });
    }, [navigate, returnTo]);

    return (
        <header className='flex items-center justify-between bg-gray-900 px-4 py-3 text-white shadow-lg'>
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={onMenuOpen}
                    aria-label='Open menu'
                >
                    <Menu size={20} />
                </Button>
                <ScriptMenu />
                <Link
                    to='/'
                    className='flex items-center gap-3'
                >
                    <img
                        src='/tanstack-word-logo-white.svg'
                        alt='TanStack Logo'
                        className='h-10'
                    />
                    <h1 className='hidden text-xl font-semibold text-white md:block'>Start</h1>
                </Link>
            </div>

            <div className='flex items-center gap-3'>
                <InvitesButton />
                {!user && isAuthLoading && <span className='text-sm text-gray-300'>Checking session…</span>}
                {user ?
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <Button
                                variant='outline'
                                size='sm'
                                className='flex items-center gap-3'
                            >
                                <Avatar className='bg-gray-800 border border-white/10 shadow-inner'>
                                    <AvatarFallback>
                                        <User size={18} />
                                    </AvatarFallback>
                                </Avatar>
                                <span className='text-sm font-medium text-white'>{user.name}</span>
                                <ChevronDown size={16} />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className='z-50 min-w-[180px] rounded-xl border border-white/10 bg-slate-900/90 p-2 shadow-lg shadow-black/40'>
                            <DropdownMenu.Item
                                className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                                onSelect={onLogout}
                            >
                                <LogOut size={16} />
                                Logout
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                :   <>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleLogin}
                            className='flex items-center gap-2'
                        >
                            <LogIn size={16} />
                            Login
                        </Button>
                        <Button
                            variant='default'
                            size='sm'
                            onClick={handleRegister}
                            className='flex items-center gap-2'
                        >
                            <UserPlus size={16} />
                            Register
                        </Button>
                    </>}
            </div>
        </header>
    );
}
