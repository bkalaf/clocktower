// src/components/AppShell.tsx
import { ThemeProvider } from 'next-themes';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import { TopBar } from './TopBar';
import tokenTable from '@/assets/images/token-table.png';
import { BottomBar } from './header/BottomBar';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            defaultTheme='dark'
            storageKey='vite-ui-theme'
        >
            <SidebarProvider>
                <AppSidebar />

                {/* The ONLY place that touches viewport height */}
                <SidebarInset className='h-svh'>
                    {/* Chrome + content column */}
                    <div className='flex h-full flex-col overflow-hidden p-0'>
                        <TopBar />
                        <AppSidebar />
                        {/* This is the remaining usable space */}
                        <main
                            style={{ backgroundImage: `url(${tokenTable})` }}
                            className='min-h-0 bg-cover bg-center flex-1 overflow-hidden'
                        >
                            {/* <div className='absolute inset-0'>
                                <img
                                    src={tokenTable}
                                    alt=''
                                    className='h-full w-full object-contain object-center opacity-70'
                                />
                                <div className='absolute inset-0 bg-linear-to-br from-slate-950/75 via-slate-950/60 to-slate-950/80' />
                            </div> */}
                            {children}
                        </main>
                        <BottomBar />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
