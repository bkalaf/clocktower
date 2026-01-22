// src/routes/__root.tsx
import * as React from 'react';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import appCss from './../assets/css/app.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NotFound } from '../components/NotFound';
import { AppShell } from '../components/AppShell';
import { ModalHost } from '../ui/modals/ModalHost';
import { whoamiFn } from '../lib/api';

interface MyRouterContext {
    queryClient: QueryClient;
    session: SessionContextValue;
    userId?: string;
    username?: string;
    roomId?: string;
    gameId?: string;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                title: 'TanStack Start Starter'
            }
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss
            }
        ]
    }),

    validateSearch: (search: Record<string, unknown>): RootSearch => {
        const modal = typeof search.modal === 'string' ? search.modal : undefined;
        const type = typeof search.type === 'string' ? search.type : undefined;
        return { modal: modal as RootSearch['modal'], type: type as RootSearch['type'] };
    },
    component: RootLayout,
    shellComponent: RootShellComponent,
    notFoundComponent: NotFound,
    loader: async ({ context }) => {
        const data = await context.queryClient.ensureQueryData({
            queryKey: ['whoami'],
            queryFn: async () => {
                return whoamiFn();
            }
        });
        const { user } = data;
        return { userId: user?._id, username: user?.username };
    }
});

function RootShellComponent({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <HeadContent />
            </head>
            <body>
                <SidebarProvider>{children}</SidebarProvider>
                <TanStackDevtools
                    config={{
                        position: 'bottom-right'
                    }}
                    plugins={[
                        {
                            name: 'Tanstack Router',
                            render: <TanStackRouterDevtoolsPanel />
                        },
                        TanStackQueryDevtools
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}

function RootLayout() {
    const search = Route.useSearch();
    const context = Route.useLoaderData();
    const isAuth = React.useMemo(() => context.userId !== undefined, [context.userId]);
    return (
        <div className='relative flex min-h-screen w-full overflow-hidden bg-slate-950 text-white'>
            <AppShell
                isAuth={isAuth}
                username={context.username}
            >
                <Outlet />
                <ModalHost {...search} />
            </AppShell>
            {/* <AppSidebar />
            <div className='flex flex-1 flex-shrink flex-col'>
                <TopBar />
                <main className='relative flex-1 overflow-hidden h-full w-full'>
                    <div className='absolute inset-0 z-20 flex items-center justify-center'>
                        <Outlet />
                        <ModalHost
                            modal={search.modal}
                            type={search.type}
                        />
                    </div>
                </main>
                <BottomBar />
            </div> */}
        </div>
    );
}
