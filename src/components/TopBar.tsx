// src/components/TopBar.tsx
//src/components/TopBar.tsx
import { SidebarTrigger } from './ui/sidebar';
import { TopBarMobileMenu } from '@/components/top-bar/TopBarMobileMenu';
import { TopBarBreadcrumbs } from '@/components/top-bar/TopBarBreadcrumbs';
import { TopBarScriptsMenu } from '@/components/top-bar/TopBarScriptsMenu';
import { TopBarPreferencesDialog } from '@/components/top-bar/TopBarPreferencesDialog';

export function TopBar() {
    return (
        <header className='sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-3'>
            <div className='hidden md:flex'>
                <SidebarTrigger />
            </div>
            <TopBarMobileMenu />
            <TopBarBreadcrumbs />
            <div className='ml-auto flex items-center gap-2'>
                <TopBarScriptsMenu />
                <TopBarPreferencesDialog />
            </div>
        </header>
    );
}

// export function SettingsSubheader({ subheader }: { subheader: string }) {
//     return (
//         <div className='border-b border-border/60 pb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
//             {subheader}
//         </div>
//     );
// }
