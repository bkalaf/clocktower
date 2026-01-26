import fs from 'fs/promises';
import path from 'path';

type CountMap = Record<string, number>;

interface CliArgs {
    dir: string;
    top: number;
}

function parseCliArgs(argv: string[]): CliArgs {
    const args = [...argv];
    const getValue = (flag: string): string | null => {
        const index = args.indexOf(flag);
        if (index === -1 || index === args.length - 1) {
            return null;
        }
        const value = args[index + 1];
        args.splice(index, 2);
        return value;
    };

    const dirValue = getValue('--dir') ?? 'eidolon_ngrams';
    const topValue = getValue('--top') ?? '10';

    const top = Number.parseInt(topValue, 10);
    if (Number.isNaN(top) || top <= 0) {
        throw new Error('--top must be a positive integer');
    }

    return {
        dir: path.resolve(dirValue),
        top
    };
}

async function readCountMap(dir: string, filename: string): Promise<CountMap> {
    const filePath = path.join(dir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as CountMap;
}

function topOfMap(map: CountMap, limit: number): [string, number][] {
    return Object.entries(map)
        .sort((a, b) => {
            const delta = b[1] - a[1];
            if (delta !== 0) return delta;
            return a[0].localeCompare(b[0], 'en', { sensitivity: 'base' });
        })
        .slice(0, limit);
}

function printTopEntries(title: string, entries: [string, number][]): void {
    console.log(`\n${title}`);
    entries.forEach(([key, value], index) => {
        console.log(`${index + 1}. ${key} — ${value}`);
    });
    if (entries.length === 0) {
        console.log('  (no entries)');
    }
}

async function main(): Promise<void> {
    const { dir, top } = parseCliArgs(process.argv.slice(2));
    const targets: Array<{ label: string; filename: string }> = [
        { label: 'Top ability tokens', filename: 'ability_token_counts.json' },
        { label: 'Top ability bigrams', filename: 'ability_bigrams.json' },
        { label: 'Top ability trigrams', filename: 'ability_trigrams.json' }
    ];

    for (const target of targets) {
        try {
            const map = await readCountMap(dir, target.filename);
            const entries = topOfMap(map, top);
            printTopEntries(target.label, entries);
        } catch (error) {
            console.warn(`Unable to read ${target.filename}: ${(error as Error).message}`);
        }
    }
}

const entryFile = path.basename(process.argv[1] ?? '');
if (entryFile === 'reportAbilityNgrams.js' || entryFile === 'reportAbilityNgrams.ts') {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export { parseCliArgs, topOfMap, printTopEntries, readCountMap };
