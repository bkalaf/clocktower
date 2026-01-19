import { api } from '../src/shared/api/endpoints';
import { makeQueryKey, pathToKeyParts } from '../src/shared/api/queryKeys';

type AnyObj = Record<string, unknown>;

function isEndpoint(value: unknown): value is { path: string; kind: string } {
    return typeof value === 'object' && value !== null && 'path' in value && 'kind' in (value as AnyObj);
}

function walk(obj: AnyObj, prefix: string[] = []): Array<{ name: string; endpoint: AnyObj }> {
    const entries: Array<{ name: string; endpoint: AnyObj }> = [];

    for (const [key, value] of Object.entries(obj)) {
        if (!value) continue;
        if (isEndpoint(value)) {
            entries.push({ name: [...prefix, key].join('.'), endpoint: value });
        } else if (typeof value === 'object') {
            entries.push(...walk(value as AnyObj, [...prefix, key]));
        }
    }

    return entries;
}

function exampleParamsFromPath(path: string): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    for (const part of pathToKeyParts(path)) {
        if (part.startsWith(':')) {
            const name = part.slice(1);
            params[name] = `<${name}>`;
        }
    }
    return params;
}

function main() {
    const entries = walk(api);

    const rows = entries
        .sort((a, b) => a.endpoint.path.localeCompare(b.endpoint.path))
        .map(({ name, endpoint }) => {
            const params = exampleParamsFromPath(endpoint.path as string);
            const key = makeQueryKey(endpoint.path as string, params, undefined);
            return {
                name,
                kind: endpoint.kind as string,
                path: endpoint.path as string,
                keyExample: JSON.stringify(key)
            };
        });

    const byKind = {
        query: rows.filter((r) => r.kind === 'query'),
        command: rows.filter((r) => r.kind === 'command')
    };

    console.log('\n=== API Registry ===\n');
    console.log(`Queries:  ${byKind.query.length}`);
    console.log(`Commands: ${byKind.command.length}\n`);

    const print = (title: string, items: typeof rows) => {
        console.log(`--- ${title} ---`);
        for (const r of items) {
            console.log(`${r.path}  [${r.kind}]  (${r.name})`);
            console.log(`  queryKey: ${r.keyExample}`);
        }
        console.log('');
    };

    print('Queries', byKind.query);
    print('Commands', byKind.command);
}

main();
