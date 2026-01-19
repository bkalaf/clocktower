// src/routes/__root.tsx
import * as React from 'react';
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import Header, { BottomBar } from '../components/header';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import appCss from './../assets/css/app.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '../state/useAuth';
import { PreferencesProvider } from '../state/usePreferences';
import { ModalHost } from '../ui/modals/ModalHost';
import type { SessionContextValue } from '../session/SessionProvider';
import type { RootSearch } from '../router/search';
import tokenTable from '../assets/images/token-table.png';

interface MyRouterContext {
    queryClient: QueryClient;
    session: SessionContextValue;
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
    shellComponent: RootDocument,
    notFoundComponent: NotFound
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <HeadContent />
            </head>
            <body>
                <PreferencesProvider>
                    <AuthProvider>{children}</AuthProvider>
                </PreferencesProvider>
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

    return (
        <div className='relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 text-white'>
            <Header />

            <main className='relative flex-1 overflow-hidden'>
                <div className='absolute inset-0'>
                    <img
                        src={tokenTable}
                        alt=''
                        className='h-full w-full object-cover object-center opacity-70'
                    />
                    <div className='absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-950/60 to-slate-950/80' />
                </div>

                <div className='relative z-10 flex min-h-full flex-col gap-6 px-4 py-6 pb-28 sm:px-6 lg:px-10'>
                    <Outlet />
                    <ModalHost
                        modal={search.modal}
                        type={search.type}
                    />
                </div>
            </main>

            <BottomBar />
        </div>
    );
}

function NotFound() {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center gap-4 px-3 text-center text-slate-600'>
            <p className='text-5xl font-semibold text-slate-900'>404</p>
            <p className='max-w-sm text-lg'>
                The page you were looking for could not be found. Try returning{' '}
                <Link to='/'>
                    <strong className='underline'>home</strong>
                </Link>
                .
            </p>
        </main>
    );
}
