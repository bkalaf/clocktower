// src/components/AppSidebar.tsx
import { Link } from '@tanstack/react-router';

import { SidebarBrandToggle } from './sidebar/SidebarBrandToggle';
import { SidebarMenuLinks } from './sidebar/SidebarMenuLinks';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from './ui/sidebar';

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='flex items-center justify-between gap-3 px-3 py-4'>
                <div className='flex items-center gap-3'>
                    <SidebarBrandToggle />
                    <div>
                        <div className='text-xs font-semibold uppercase tracking-[0.4em] text-slate-400'>
                            Clocktower
                        </div>
                        <Link
                            to='/'
                            className='text-[11px] uppercase tracking-[0.35em] text-slate-300'
                        >
                            Command Deck
                        </Link>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className='space-y-3'>
                <SidebarMenuLinks />
            </SidebarContent>

            <SidebarFooter className='border-t border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-500'>
                <p>Live setup</p>
            </SidebarFooter>
        </Sidebar>
    );
}
