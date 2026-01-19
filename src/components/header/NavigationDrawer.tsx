import { Link } from '@tanstack/react-router';
import { Home, Lock, LogIn, Mail, Settings, UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent } from '@/components/ui/sheet';
import { useModal } from '@/ui/modals/useModal';

import demonHead from '@/assets/images/demon-head.png';

type NavigationDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
};

const navItems = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/login', label: 'Login', icon: LogIn },
    { to: '/register', label: 'Register', icon: UserPlus },
    { to: '/forgot-password', label: 'Forgot password', icon: Lock }
];

const itemBase =
    'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold text-white transition-colors duration-150';

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
    const { open } = useModal();

    const handleOpen = (callback: () => void) => () => {
        callback();
        onClose();
    };

    return (
        <Sheet
            open={isOpen}
            onOpenChange={(openState) => {
                if (!openState) {
                    onClose();
                }
            }}
        >
            <SheetContent
                side='left'
                className='relative flex h-full w-72 flex-col bg-slate-950/90 border-r border-white/10 p-0 shadow-2xl shadow-black/50'
            >
                <div className='flex items-center justify-between border-b border-white/10 px-4 py-3'>
                    <div className='flex items-center gap-3'>
                        <img
                            src={demonHead}
                            alt='Demon head logo'
                            className='h-12 w-12 rounded-full border border-white/20 object-cover'
                        />
                        <div>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-white'>Clocktower</p>
                            <p className='text-[10px] uppercase tracking-[0.4em] text-slate-400'>Sidebar</p>
                        </div>
                    </div>
                    <SheetClose asChild>
                        <Button
                            variant='ghost'
                            size='icon'
                            aria-label='Close navigation'
                        >
                            <X size={18} />
                        </Button>
                    </SheetClose>
                </div>

                <nav className='flex flex-1 flex-col gap-2 px-3 py-4'>
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={`${itemBase} hover:bg-white/5`}
                            activeProps={{
                                className: `${itemBase} bg-cyan-700/70`
                            }}
                        >
                            <item.icon className='h-4 w-4 text-cyan-300' />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className='border-t border-white/10 px-3 py-4'>
                    <p className='text-[10px] uppercase tracking-[0.4em] text-slate-500'>Tools</p>
                    <div className='mt-2 flex flex-col gap-2'>
                        <Button
                            size='sm'
                            variant='ghost'
                            className='flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4em]'
                            onClick={handleOpen(() => open('preferences'))}
                        >
                            <Settings size={16} />
                            Preferences
                        </Button>
                        <Button
                            size='sm'
                            variant='ghost'
                            className='flex items-center gap-2 rounded-2xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4em]'
                            onClick={handleOpen(() => open('invites'))}
                        >
                            <Mail size={16} />
                            Invites
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
