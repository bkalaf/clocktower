// src/shared/api/queryKeys.ts
export type QueryKey = readonly (string | number | boolean | null | undefined | object)[];

export function pathToKeyParts(path: string): string[] {
    return path
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean);
}

export function makeQueryKey(path: string, params?: Record<string, unknown>, input?: unknown): QueryKey {
    const base = pathToKeyParts(path).map((part) => {
        if (part.startsWith(':')) {
            const name = part.slice(1);
            const v = params?.[name];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return v == null ? part : (v as any);
        }
        return part;
    });

    return input === undefined ? (base as QueryKey) : ([...base, { input }] as QueryKey);
}
