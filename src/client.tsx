// src/client.tsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Await, RouterProvider } from '@tanstack/react-router';
import { hydrateStart } from '@tanstack/react-start-client';
import type { AnyRouter } from '@tanstack/router-core';
import { Provider as TanstackQueryProvider } from './integrations/tanstack-query/root-provider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './client/state/store';

let hydrationPromise: Promise<AnyRouter> | null = null;

function getHydrationPromise() {
    if (!hydrationPromise) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrationPromise = hydrateStart() as any;
    }
    return hydrationPromise;
}

function AppRouter() {
    return (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Await promise={getHydrationPromise() as any}>
            {(router: AnyRouter) => {
                const queryClient = router.options.context?.queryClient;
                if (!queryClient) {
                    throw new Error('Missing query client on router context');
                }

                return (
                    <TanstackQueryProvider queryClient={queryClient}>
                        <RouterProvider
                            router={router as any}
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
            <AppRouter />
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
