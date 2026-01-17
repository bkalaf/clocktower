import { Link } from '@tanstack/react-router';
import { Home, LogIn, LogOut, Menu, Network, StickyNote, User, UserPlus } from 'lucide-react';

import { AuthUser } from '@/hooks/useAuthUser';
import { Button } from '@/components/ui/button';

export type TopBarProps = {
    user: AuthUser | null;
    isAuthLoading: boolean;
    onMenuOpen: () => void;
    onOpenLogin: () => void;
    onOpenRegister: () => void;
    onOpenLogout: () => void;
};

export function TopBar({
    user,
    isAuthLoading,
    onMenuOpen,
    onOpenLogin,
    onOpenRegister,
    onOpenLogout
}: TopBarProps) {
    return (
        <header className='px-4 py-3 flex items-center justify-between bg-gray-900 text-white shadow-lg'>
            <div className='flex items-center gap-4'>
                <Button
                    variant='ghost'
                    size='lg'
                    onClick={onMenuOpen}
                    className='p-2 bg-transparent hover:bg-gray-800 rounded-lg'
                    aria-label='Open menu'
                >
                    <Menu size={24} />
                </Button>
                <Link to='/' className='flex items-center gap-3'>
                    <img src='/tanstack-word-logo-white.svg' alt='TanStack Logo' className='h-10' />
                    <h1 className='text-xl font-semibold text-white hidden md:block'>Start</h1>
                </Link>
            </div>

            <div className='flex items-center gap-3'>
                {!user && isAuthLoading && (
                    <span className='text-sm text-gray-300'>Checking session…</span>
                )}
                {user ? (
                    <>
                        <Button variant='outline' size='lg' onClick={onOpenLogout} className='flex items-center gap-2'>
                            <LogOut size={16} />
                            Logout
                        </Button>
                        <div className='flex flex-col items-center'>
                            <div className='h-12 w-12 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center shadow-inner'>
                                <User size={24} />
                            </div>
                            <span className='text-xs text-gray-300 mt-1 text-center'>{user.name}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Button variant='outline' size='lg' onClick={onOpenLogin} className='flex items-center gap-2'>
                            <LogIn size={16} />
                            Login
                        </Button>
                        <Button variant='default' size='lg' onClick={onOpenRegister} className='flex items-center gap-2'>
                            <UserPlus size={16} />
                            Register
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
