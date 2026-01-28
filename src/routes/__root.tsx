// src/routes/__root.tsx
import * as React from 'react';
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import appCss from './../assets/css/app.css?url';
import type { QueryClient } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { RightSidebarProvider } from '@/components/ui/sidebar-right';
import { NotFound } from '../components/NotFound';
import { AppShell } from '../components/AppShell';
import { ModalHost } from '../ui/modals/ModalHost';
import { store } from '../client/state/store';
import { Provider } from 'react-redux';
import { useAppDispatch } from '@/client/state/hooks';
import { authActions } from '@/client/state/authSlice';
import { themeActions, DEFAULT_THEME_STATE } from '@/client/state/themeSlice';
import { whoamiFn } from '@/lib/api';

const ASSET_BASE_URL = (import.meta.env.VITE_ASSET_BASE_URL ?? '').replace(/\/$/, '');

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
        const returnTo = typeof search.returnTo === 'string' ? search.returnTo : undefined;
        const scriptId = typeof search.scriptId === 'string' ? search.scriptId : undefined;
        return {
            modal: modal as RootSearch['modal'],
            type: type as RootSearch['type'],
            returnTo,
            scriptId
        };
    },
    component: RootLayout,
    shellComponent: RootShellComponent,
    notFoundComponent: NotFound
    // loader: async ({ context }) => {
    //     const data = await context.queryClient.ensureQueryData({
    //         queryKey: ['whoami'],
    //         queryFn: async () => {
    //             return whoamiFn();
    //         }
    //     });
    //     const { user } = data;
    //     const state = store.getState();
    //     if (state.realtime.session?.context.userId !== user?._id) {
    //         store.dispatch(
    //             authActions.login({
    //                 userId: user?._id,
    //                 username: user?.username
    //             })
    //         );
    //     }
    // }
});

function RootShellComponent({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <HeadContent />
            </head>
            <body>
                <Provider store={store}>
                    <SidebarProvider defaultOpen={false}>
                        <RightSidebarProvider defaultOpen={false}>{children}</RightSidebarProvider>
                    </SidebarProvider>
                </Provider>
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
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        let isMounted = true;
        const loadUser = async () => {
            const buildAvatarUrl = (path?: string) => {
                if (!path) return undefined;
                const trimmed = path.trim();
                if (!trimmed) return undefined;
                if (/^https?:\/\//i.test(trimmed)) {
                    return trimmed;
                }
                const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
                return ASSET_BASE_URL ? `${ASSET_BASE_URL}${normalized}` : normalized;
            };

            try {
                const { user } = await whoamiFn();
                if (!isMounted) return;
                if (user) {
                    const displayName = user.displayName ?? user.username;
                    const avatarUrl = buildAvatarUrl(user.avatarPath);
                    dispatch(
                        authActions.setUser({
                            userId: user._id,
                            username: user.username,
                            displayName,
                            avatarUrl,
                            scopes: user.userRoles ?? []
                        })
                    );
                    dispatch(themeActions.setSettings(user.settings ?? DEFAULT_THEME_STATE));
                } else {
                    dispatch(authActions.clearUser());
                    dispatch(themeActions.setSettings(DEFAULT_THEME_STATE));
                }
            } catch (error) {
                if (!isMounted) return;
                dispatch(authActions.clearUser());
                dispatch(themeActions.setSettings(DEFAULT_THEME_STATE));
                console.error(error);
            }
        };
        void loadUser();
        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    return (
        <div className='relative flex min-h-screen w-full overflow-hidden bg-slate-950 text-white'>
            <AppShell>
                <Outlet />
                <ModalHost {...search} />
            </AppShell>
        </div>
    );
}
