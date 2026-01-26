import fs from 'fs/promises';
import path from 'path';
import type { NormalizedWikiPage } from '../src/spec/wikiTypes';

const STOPWORDS = new Set([
    'a',
    'an',
    'the',
    'and',
    'or',
    'to',
    'of',
    'in',
    'on',
    'for',
    'with',
    'as',
    'at',
    'by',
    'from',
    'your',
    'you',
    'are',
    'is',
    'be',
    'been',
    'being',
    'do',
    'does',
    'did',
    'not',
    'no'
]);

function parseCliArgs(argv: string[]): { inputDir: string; outputDir: string } {
    const args = [...argv];
    const getValue = (flag: string) => {
        const index = args.indexOf(flag);
        if (index === -1 || index === args.length - 1) {
            return null;
        }
        const value = args[index + 1];
        args.splice(index, 2);
        return value;
    };

    const inputDir = getValue('--in');
    const outputDir = getValue('--out');

    if (!inputDir || !outputDir) {
        throw new Error('Usage: node ./dist/scripts/analyzeAbilityNgrams.js --in <normalizedPagesDir> --out <outputDir>');
    }

    return {
        inputDir: path.resolve(inputDir),
        outputDir: path.resolve(outputDir)
    };
}

function writeJson(file: string, data: unknown): Promise<void> {
    return fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function tokenizeAbilityText(text: string): { tokens: string[]; stopwordCount: number } {
    const normalized = text
        .replace(/\*/g, ' STAR ')
        .replace(/\[/g, ' ACCEPT_MODIFIER ')
        .replace(/\]/g, ' ACCEPT_MODIFIER ')
        .replace(/[^\w\s]/g, ' ');

    const rawTokens = normalized
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => (token === 'STAR' || token === 'ACCEPT_MODIFIER' ? token : token.toLowerCase()));

    const tokens: string[] = [];
    let stopwordCount = 0;

    for (const token of rawTokens) {
        if (STOPWORDS.has(token)) {
            stopwordCount += 1;
            continue;
        }
        tokens.push(token);
    }

    return { tokens, stopwordCount };
}

function accumulateNgramCounts(
    tokens: string[],
    tokenCounts: Record<string, number>,
    bigramCounts: Record<string, number>,
    trigramCounts: Record<string, number>
): void {
    for (const token of tokens) {
        tokenCounts[token] = (tokenCounts[token] ?? 0) + 1;
    }

    for (let i = 0; i < tokens.length - 1; i += 1) {
        const bigram = `${tokens[i]} ${tokens[i + 1]}`;
        bigramCounts[bigram] = (bigramCounts[bigram] ?? 0) + 1;
    }

    for (let i = 0; i < tokens.length - 2; i += 1) {
        const trigram = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
        trigramCounts[trigram] = (trigramCounts[trigram] ?? 0) + 1;
    }
}

function sortCountMap(counts: Record<string, number>): Record<string, number> {
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

async function main() {
    const { inputDir, outputDir } = parseCliArgs(process.argv.slice(2));
    const files = await fs.readdir(inputDir);
    await fs.mkdir(outputDir, { recursive: true });

    const tokenCounts: Record<string, number> = {};
    const bigramCounts: Record<string, number> = {};
    const trigramCounts: Record<string, number> = {};
    let totalRolesProcessed = 0;
    let totalAbilityTextsProcessed = 0;
    let totalTokens = 0;
    let stopwordCount = 0;

    for (const filename of files) {
        if (!filename.endsWith('.json')) {
            continue;
        }

        totalRolesProcessed += 1;
        const filepath = path.join(inputDir, filename);
        const raw = await fs.readFile(filepath, 'utf-8');
        const page: NormalizedWikiPage = JSON.parse(raw);
        const abilityText = String(page.abilityText ?? '').trim();
        if (!abilityText) {
            continue;
        }

        totalAbilityTextsProcessed += 1;
        const { tokens, stopwordCount: removed } = tokenizeAbilityText(abilityText);
        stopwordCount += removed;
        totalTokens += tokens.length;

        accumulateNgramCounts(tokens, tokenCounts, bigramCounts, trigramCounts);
    }

    await writeJson(path.join(outputDir, 'ability_token_counts.json'), sortCountMap(tokenCounts));
    await writeJson(path.join(outputDir, 'ability_bigrams.json'), sortCountMap(bigramCounts));
    await writeJson(path.join(outputDir, 'ability_trigrams.json'), sortCountMap(trigramCounts));
    await writeJson(path.join(outputDir, 'analysis_meta.json'), {
        totalRolesProcessed,
        totalAbilityTextsProcessed,
        totalTokens,
        stopwordCount,
        generatedAt: new Date().toISOString()
    });

    console.log(`Processed ${totalRolesProcessed} roles (${totalAbilityTextsProcessed} abilities).`);
    console.log(`Collected ${totalTokens} tokens (removed ${stopwordCount} stopwords).`);
    console.log(`Outputs written to ${outputDir}.`);
}

if (import.meta.main) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export { tokenizeAbilityText, accumulateNgramCounts, sortCountMap, STOPWORDS };
