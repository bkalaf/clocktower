// src/components/top-bar/TopBarMobileMenu.tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { TopBarSidebarNav } from './TopBarSidebarNav';

export function TopBarMobileMenu() {
    return (
        <div className='md:hidden'>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant='ghost'
                        size='icon'
                        aria-label='Open menu'
                    >
                        <Menu className='h-5 w-5' />
                    </Button>
                </SheetTrigger>

                <SheetContent
                    side='left'
                    className='w-72'
                >
                    <div className='mb-4 text-sm font-semibold'>BOTC AI</div>
                    <TopBarSidebarNav />
                </SheetContent>
            </Sheet>
        </div>
    );
}
