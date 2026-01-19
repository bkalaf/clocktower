// src/components/AppSidebar.tsx
import { SidebarBrandToggle } from './header/sidebar/SidebarBrandToggle';
import { SidebarMenuLinks } from './header/sidebar/SidebarMenuLinks';
import { SidebarHeader, SidebarContent, Sidebar } from './ui/sidebar';

// src/components/AppSidebar.tsx
export function AppSidebar() {
    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className='flex h-14 items-center justify-center px-3'>
                <SidebarBrandToggle />
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenuLinks />
            </SidebarContent>
        </Sidebar>
    );
}
