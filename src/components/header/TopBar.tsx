// src/components/header/TopBar.tsx
import { Link } from '@tanstack/react-router';
import { LogIn, LogOut, Menu, User, UserPlus } from 'lucide-react';

import { AuthUser } from '@/hooks/useAuthUser';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export type TopBarProps = {
    user: AuthUser | null;
    isAuthLoading: boolean;
    onMenuOpen: () => void;
    onOpenLogin: () => void;
    onOpenRegister: () => void;
    onOpenLogout: () => void;
};

export function TopBar({ user, isAuthLoading, onMenuOpen, onOpenLogin, onOpenRegister, onOpenLogout }: TopBarProps) {
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
                {!user && isAuthLoading && <span className='text-sm text-gray-300'>Checking session…</span>}
                {user ?
                    <>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={onOpenLogout}
                            className='flex items-center gap-2'
                        >
                            <LogOut size={16} />
                            Logout
                        </Button>
                        <div className='flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-1'>
                            <Avatar className='bg-gray-800 border border-white/10 shadow-inner'>
                                <AvatarFallback>
                                    <User size={18} />
                                </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col text-right text-xs text-gray-300'>
                                <span className='text-sm font-medium text-white'>{user.name}</span>
                            </div>
                        </div>
                    </>
                :   <>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={onOpenLogin}
                            className='flex items-center gap-2'
                        >
                            <LogIn size={16} />
                            Login
                        </Button>
                        <Button
                            variant='default'
                            size='sm'
                            onClick={onOpenRegister}
                            className='flex items-center gap-2'
                        >
                            <UserPlus size={16} />
                            Register
                        </Button>
                    </>
                }
            </div>
        </header>
    );
}
