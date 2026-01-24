// src/client.tsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Await, RouterProvider } from '@tanstack/react-router';
import { hydrateStart } from '@tanstack/react-start-client';
import type { AnyRouter } from '@tanstack/router-core';
import { Provider as TanstackQueryProvider } from './integrations/tanstack-query/root-provider';
import { Provider as ReduxProvider } from 'react-redux';
import { AuthProvider } from './state/useAuth';
import { store } from './client/state/store';

let hydrationPromise: Promise<AnyRouter> | null = null;

function getHydrationPromise() {
    if (!hydrationPromise) {
        hydrationPromise = hydrateStart();
    }
    return hydrationPromise;
}

function AppRouter() {
    return (
        <Await promise={getHydrationPromise()}>
            {(router) => {
                const queryClient = router.options.context?.queryClient;
                if (!queryClient) {
                    throw new Error('Missing query client on router context');
                }

                return (
                    <TanstackQueryProvider queryClient={queryClient}>
                        <RouterProvider
                            router={router}
                            context={{}}
                        />
                    </TanstackQueryProvider>
                );
            }}
        </Await>
    );
}

function App() {
    return (
        <ReduxProvider store={store}>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </ReduxProvider>
    );
}

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <App />
        </StrictMode>
    );
});
