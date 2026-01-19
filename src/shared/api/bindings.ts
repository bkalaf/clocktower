// src/shared/api/bindings.ts
import type { QueryClient, QueryKey } from '@tanstack/react-query';
import { makeQueryKey } from './queryKeys';
import type { EndpointSpec, InferInput, InferOutput } from './endpoint';

export type ServerFn<I, O> = (input: I) => Promise<O>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bindQuery<E extends EndpointSpec<'query', any, any>>(opts: {
    endpoint: E;
    fn: ServerFn<InferInput<E>, InferOutput<E>>;
    getParams: (input: InferInput<E>) => Record<string, unknown>;
}) {
    const { endpoint, fn, getParams } = opts;

    const run = async (input: InferInput<E>) => {
        const parsedIn = endpoint.input.parse(input);
        const result = await fn(parsedIn);
        return endpoint.output.parse(result);
    };

    return {
        endpoint,
        fn,
        queryKey: (input: InferInput<E>) => makeQueryKey(endpoint.path, getParams(input), input),
        queryOptions: (input: InferInput<E>) => ({
            queryKey: makeQueryKey(endpoint.path, getParams(input), input) as QueryKey,
            queryFn: () => run(input)
        }),
        ensure: async (qc: QueryClient, input: InferInput<E>) => {
            return qc.ensureQueryData({
                queryKey: makeQueryKey(endpoint.path, getParams(input), input) as QueryKey,
                queryFn: () => run(input)
            });
        }
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bindCommand<E extends EndpointSpec<'command', any, any>>(opts: {
    endpoint: E;
    fn: ServerFn<InferInput<E>, InferOutput<E>>;
}) {
    const { endpoint, fn } = opts;

    const run = async (input: InferInput<E>) => {
        const parsedIn = endpoint.input.parse(input);
        const result = await fn(parsedIn);
        return endpoint.output.parse(result);
    };

    return {
        endpoint,
        fn,
        mutationOptions: () => ({
            mutationFn: (input: InferInput<E>) => run(input)
        })
    };
}
