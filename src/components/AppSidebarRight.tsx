// src/components/AppSidebarRight.tsx
import { RightSidebar, RightSidebarContent, RightSidebarFooter, RightSidebarHeader } from './ui/sidebar-right';

export function AppSidebarRight() {
    return (
        <RightSidebar side='right' collapsible='icon'>
            <RightSidebarHeader className='flex items-center justify-center gap-2 border-b border-white/10 px-3 py-4 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400'>
                Room Tools
            </RightSidebarHeader>

            <RightSidebarContent className='space-y-3 px-3 py-2 text-sm text-slate-300'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500'>Live insights</p>
                <p className='text-xs text-slate-400'>Placeholder content for room/game controls.</p>
            </RightSidebarContent>

            <RightSidebarFooter className='border-t border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.35em] text-slate-500'>
                Coming soon
            </RightSidebarFooter>
        </RightSidebar>
    );
}
