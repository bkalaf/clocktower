import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { tokenize, tokenName } from './tokenPipeline.ts';
import type { LexRule, Token } from './tokenPipeline.ts';
import type { NormalizedWikiPage } from '../src/spec/wikiTypes';

const DEFAULT_STOPWORD_LIST = [
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
];

const DEFAULT_CONFIG_PATH = path.resolve('scripts', 'tokenNormalizationConfig.ts');

type CountMap = Record<string, number>;

interface RegexAlias {
    alias: string;
    regex: RegExp;
    handler?: (match: RegExpMatchArray) => string[];
}

interface CliOptions {
    inputDir: string;
    outputDir: string;
    configPath?: string;
}

interface NormalizationConfig {
    lexRules?: LexRule[];
    ignored?: string[];
    regex?: Record<string, [string, ((match: RegExpMatchArray) => string[]) | undefined]>;
}

function parseCliArgs(argv: string[]): CliOptions {
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
    const configPath = getValue('--config');

    if (!inputDir || !outputDir) {
        throw new Error(
            'Usage: node ./dist/scripts/analyzeAbilityNgrams.js --in <normalizedPagesDir> --out <outputDir>'
        );
    }

    return {
        inputDir: path.resolve(inputDir),
        outputDir: path.resolve(outputDir),
        configPath: configPath ? path.resolve(configPath) : undefined
    };
}

function buildRegexAliases(config: NormalizationConfig['regex']): RegexAlias[] {
    if (!config) {
        return [];
    }

    const entries: RegexAlias[] = [];
    for (const [alias, tuple] of Object.entries(config)) {
        if (!Array.isArray(tuple) || typeof tuple[0] !== 'string') {
            continue;
        }
        const pattern = tuple[0];
        try {
            const regex = new RegExp(pattern, 'gu');
            const handler =
                typeof tuple[1] === 'function' ? (tuple[1] as (match: RegExpMatchArray) => string[]) : undefined;
            entries.push({ alias: alias.trim(), regex, handler });
        } catch {
            continue;
        }
    }

    return entries;
}

async function loadNormalizationConfig(filePath: string | undefined): Promise<{
    lexRules?: LexRule[];
    regexAliases: RegexAlias[];
    stopwords: Set<string>;
    source?: string;
}> {
    const resolvedPath = filePath ?? DEFAULT_CONFIG_PATH;
    try {
        const parsed = await loadConfigValue(resolvedPath);
        const lexRules =
            Array.isArray(parsed.lexRules) && parsed.lexRules.length
                ? parsed.lexRules.filter((rule) => Array.isArray(rule.phrase) && rule.phrase.length > 0)
                : undefined;

        const stopwords = new Set<string>();
        if (parsed.ignored && parsed.ignored.length > 0) {
            parsed.ignored.forEach((item) => {
                const normalized = item.trim().toLowerCase();
                if (normalized) {
                    stopwords.add(normalized);
                }
            });
        } else {
            DEFAULT_STOPWORD_LIST.forEach((item) => stopwords.add(item));
        }

        const regexAliases = buildRegexAliases(parsed.regex);

        return {
            lexRules,
            regexAliases,
            stopwords,
            source: resolvedPath
        };
    } catch (error) {
        if (filePath) {
            console.warn(`Unable to load normalization config at ${resolvedPath}: ${(error as Error).message}`);
        }
        return {
            regexAliases: [],
            stopwords: new Set(DEFAULT_STOPWORD_LIST),
            source: undefined
        };
    }
}

async function loadConfigValue(resolvedPath: string): Promise<NormalizationConfig> {
    if (/\.(js|ts|mjs)$/i.test(resolvedPath)) {
        const module = await import(pathToFileURL(resolvedPath).href);
        return (module.default ?? module) as NormalizationConfig;
    }
    const raw = await fs.readFile(resolvedPath, 'utf-8');
    return (raw ? (JSON.parse(raw) as NormalizationConfig) : {}) ?? {};
}

function applyRegexMappings(text: string, regexAliases: RegexAlias[]): string {
    if (!regexAliases.length) {
        return text;
    }

    let transformed = text;
    for (const entry of regexAliases) {
        entry.regex.lastIndex = 0;
        transformed = transformed.replace(entry.regex, (...args) => {
            const match = args.slice(0, -2) as RegExpMatchArray;
            match.index = args[args.length - 2];
            match.input = args[args.length - 1];
            const handlerTokens = entry.handler ? (entry.handler(match) ?? []) : [];
            const tokens = handlerTokens.length ? handlerTokens : [entry.alias];
            return tokens.length ? ` ${tokens.join(' ')} ` : ' ';
        });
    }
    return transformed;
}

function writeJson(file: string, data: unknown): Promise<void> {
    return fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function accumulateNgramCounts(
    tokens: string[],
    tokenCounts: CountMap,
    bigramCounts: CountMap,
    trigramCounts: CountMap
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

function sortCountMap(counts: CountMap): CountMap {
    return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}

interface TokenizedTrace {
    roleKey: string;
    title: string;
    originalText: string;
    normalizedText: string;
    tokens: string[];
}

async function main() {
    const { inputDir, outputDir, configPath } = parseCliArgs(process.argv.slice(2));
    const { lexRules, regexAliases, stopwords: stopwordSet, source: configSource } =
        await loadNormalizationConfig(configPath);
    if (lexRules && lexRules.length) {
        console.log(
            `Loaded ${lexRules.length} lex rules from ${configSource ?? configPath ?? DEFAULT_CONFIG_PATH}.`
        );
    }
    if (regexAliases.length) {
        console.log(
            `Applied ${regexAliases.length} regex mappings from ${configSource ?? configPath ?? DEFAULT_CONFIG_PATH}.`
        );
    }
    if (stopwordSet.size !== DEFAULT_STOPWORD_LIST.length) {
        console.log(`Using ${stopwordSet.size} stopwords${configSource ? ` from ${configSource}` : ''}.`);
    }

    const files = await fs.readdir(inputDir);
    await fs.mkdir(outputDir, { recursive: true });

    const tokenCounts: CountMap = {};
    const bigramCounts: CountMap = {};
    const trigramCounts: CountMap = {};
    let totalRolesProcessed = 0;
    let totalAbilityTextsProcessed = 0;
    let totalTokens = 0;
    let stopwordCount = 0;
    const tokenizedTraces: TokenizedTrace[] = [];

    for (const filename of files) {
        if (!filename.endsWith('.json')) {
            continue;
        }

        totalRolesProcessed += 1;
        const filepath = path.join(inputDir, filename);
        const raw = await fs.readFile(filepath, 'utf-8');
        const page: NormalizedWikiPage = JSON.parse(raw);
        const originalText = String(page.abilityText ?? '').trim();
        if (!originalText) {
            continue;
        }

        const normalizedText = applyRegexMappings(originalText, regexAliases);
        totalAbilityTextsProcessed += 1;
        const rawTokens = tokenize(normalizedText, { lexRules });
        let removedInThisPass = 0;
        const filteredTokens: Token[] = [];

        for (const token of rawTokens) {
            if (typeof token === 'string' && stopwordSet.has(token)) {
                removedInThisPass += 1;
                continue;
            }
            filteredTokens.push(token);
        }

        stopwordCount += removedInThisPass;
        const normalizedTokens = filteredTokens.map(tokenName);
        totalTokens += normalizedTokens.length;
        tokenizedTraces.push({
            roleKey: page.roleKey,
            title: page.title,
            originalText,
            normalizedText,
            tokens: normalizedTokens
        });

        accumulateNgramCounts(normalizedTokens, tokenCounts, bigramCounts, trigramCounts);
    }

    await writeJson(path.join(outputDir, 'ability_token_counts.json'), sortCountMap(tokenCounts));
    await writeJson(path.join(outputDir, 'ability_bigrams.json'), sortCountMap(bigramCounts));
    await writeJson(path.join(outputDir, 'ability_trigrams.json'), sortCountMap(trigramCounts));
    const sortedTraces = tokenizedTraces.sort((a, b) => a.roleKey.localeCompare(b.roleKey));
    await writeJson(path.join(outputDir, 'ability_tokenized_texts.json'), sortedTraces);
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
    console.log(`Tokenized ability texts saved to ability_tokenized_texts.json.`);
}

const analyzeEntry = path.basename(process.argv[1] ?? '');
if (analyzeEntry === 'analyzeAbilityNgrams.js' || analyzeEntry === 'analyzeAbilityNgrams.ts') {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export { accumulateNgramCounts, sortCountMap, loadNormalizationConfig };
