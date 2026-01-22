// src/components/sidebar/SidebarMenuLinks.tsx
import { Home, Users, Settings, BookOpen, Clock, ClipboardList, History } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar';
import { Link as RouterLink } from '@tanstack/react-router';

const sidebarMenuItems = [
    {
        id: 'home',
        label: 'Home',
        tooltip: 'Home',
        icon: Home,
        to: '/'
    },
    {
        id: 'players',
        label: 'Players',
        tooltip: 'Players',
        icon: Users,
        to: '/'
    },
    {
        id: 'settings',
        label: 'Settings',
        tooltip: 'Settings',
        icon: Settings,
        to: '/'
    },
    {
        id: 'st-consult',
        label: 'ST Consult',
        tooltip: 'ST Consult',
        icon: BookOpen,
        to: '/'
    },
    {
        id: 'timer',
        label: 'Timer',
        tooltip: 'Timer',
        icon: Clock,
        to: '/'
    },
    {
        id: 'task-queue',
        label: 'Task Queue',
        tooltip: 'Task Queue',
        icon: ClipboardList,
        to: '/'
    },
    {
        id: 'voting-history',
        label: 'Voting History',
        tooltip: 'Voting History',
        icon: History,
        to: '/'
    }
];

export function SidebarMenuLinks() {
    return (
        <SidebarMenu>
            {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.tooltip}
                        >
                            <RouterLink
                                to={item.to}
                                className='flex items-center gap-2'
                            >
                                <Icon className='h-4 w-4 shrink-0' />
                                <span>{item.label}</span>
                            </RouterLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
