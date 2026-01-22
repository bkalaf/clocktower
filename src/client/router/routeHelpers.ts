// src/client/router/routeHelpers.ts
import type { QueryClient } from '@tanstack/react-query';

export type RouterContext = {
    queryClient: QueryClient;
};

export function makeBeforeLoadEnsure<TParams, TData>(opts: {
    ensure: (qc: QueryClient, params: TParams) => Promise<TData>;
}) {
    return async ({ context, params }: { context: RouterContext; params: TParams }) => {
        await opts.ensure(context.queryClient, params);
        return;
    };
}

export function makeLoaderFromEnsure<TParams, TData>(opts: {
    ensure: (qc: QueryClient, params: TParams) => Promise<TData>;
}) {
    return async ({ context, params }: { context: RouterContext; params: TParams }) => {
        return opts.ensure(context.queryClient, params);
    };
}

export function makeAction<TInput, TOutput>(opts: { act: (input: TInput) => Promise<TOutput> }) {
    return async ({ input }: { input: TInput }) => {
        return opts.act(input);
    };
}
