// src/components/sidebar/SidebarBrandToggle.tsx
import { Button } from '../ui';
import { useSidebar } from '../ui/sidebar';
import demonHead from '@/assets/images/demon-head.png';

export function SidebarBrandToggle() {
    const { toggleSidebar } = useSidebar();

    return (
        <Button
            type='button'
            onClick={toggleSidebar}
            className='flex items-center gap-2 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-ring'
            aria-label='Toggle sidebar'
        >
            <img
                src={demonHead}
                alt='Demon head logo'
                className='h-12 w-12 rounded-full border border-white/20 object-cover'
            />
            {/* Optional: show text only when expanded (if you want) */}
            {/* <span className="text-sm font-semibold">BOTC AI</span> */}
        </Button>
    );
}
