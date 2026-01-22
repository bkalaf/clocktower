// src/components/TopBarSidebarTrigger.tsx
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';

export function TopBarSidebarTrigger({ isAuth }: { isAuth: boolean }) {
    const { open, toggleSidebar, setOpen } = useSidebar();
    const Icon = useMemo(() => (open ? PanelLeftClose : PanelLeftOpen), [open]);
    useEffect(() => {
        if (open && !isAuth) {
            setOpen(false);
        }
    }, [isAuth, open, setOpen]);
    return (
        isAuth && (
            <Button
                variant='ghost'
                size='icon'
                onClick={toggleSidebar}
                aria-label='Toggle sidebar'
            >
                <Icon className='h-4 w-4' />
            </Button>
        )
    );
}
