// src/shared/api/endpoint.ts
import { makeQueryKey, type QueryKey } from './queryKeys';
import type { z } from 'zod';

export type ApiKind = 'query' | 'command';

export type EndpointSpec<TKind extends ApiKind, TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny> = {
    kind: TKind;
    path: string;
    input: TIn;
    output: TOut;
};

export type InferInput<E extends EndpointSpec<any, any, any>> = z.infer<E['input']>;
export type InferOutput<E extends EndpointSpec<any, any, any>> = z.infer<E['output']>;

export type QueryEndpoint<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny> = EndpointSpec<'query', TIn, TOut>;
export type CommandEndpoint<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny> = EndpointSpec<'command', TIn, TOut>;

export function defineQuery<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny>(
    path: string,
    input: TIn,
    output: TOut
): QueryEndpoint<TIn, TOut> {
    return { kind: 'query', path, input, output };
}

export function defineCommand<TIn extends z.ZodTypeAny, TOut extends z.ZodTypeAny>(
    path: string,
    input: TIn,
    output: TOut
): CommandEndpoint<TIn, TOut> {
    return { kind: 'command', path, input, output };
}

export function keyFor<TInput>(endpoint: { path: string }, params?: Record<string, unknown>, input?: TInput): QueryKey {
    return makeQueryKey(endpoint.path, params, input);
}
