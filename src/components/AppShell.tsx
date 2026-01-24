// src/components/AppShell.tsx
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import { TopBar } from './TopBar';
import { BottomBar } from './header/BottomBar';
import tokensDeskWindow from '@/assets/images/tokens-desk-window.png?url';

const rootBackgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${tokensDeskWindow})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
    // backgroundAttachment: 'fixed'
};
export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />

            {/* The ONLY place that touches viewport height */}
            <SidebarInset className='h-svh w-svh'>
                {/* Chrome + content column */}
                {/* <div className='flex h-full flex-col overflow-hidden p-0'> */}
                <TopBar
                    username={username}
                    isAuth={isAuth}
                />
                {/* This is the remaining usable space */}
                <main
                    className='min-h-0 bg-cover bg-center flex-1 overflow-hidden object-contain items-center justify-center'
                    style={rootBackgroundStyle}
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
                {/* </div> */}
            </SidebarInset>
        </SidebarProvider>
    );
}
