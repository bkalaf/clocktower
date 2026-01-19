// src/client.tsx
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Await, RouterProvider } from '@tanstack/react-router';
import { hydrateStart } from '@tanstack/start-client-core/client';
import type { AnyRouter } from '@tanstack/router-core';
import { Provider as TanstackQueryProvider } from './integrations/tanstack-query/root-provider';
import { SessionProvider } from './session/SessionProvider';
import { useSession } from './hooks/useSession';

let hydrationPromise: Promise<AnyRouter> | null = null;

function getHydrationPromise() {
    if (!hydrationPromise) {
        hydrationPromise = hydrateStart();
    }
    return hydrationPromise;
}

function AppRouter() {
    const session = useSession();

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
                            context={{ session }}
                        />
                    </TanstackQueryProvider>
                );
            }}
        </Await>
    );
}

function App() {
    return (
        <SessionProvider>
            <AppRouter />
        </SessionProvider>
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
