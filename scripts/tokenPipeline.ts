// Token stream helpers for BOTC-style role text parsing.
// TODO: Replace Payload with a discriminated union per token kind once AST nodes are introduced.
export type Payload = Record<string, unknown>;
export type Token = string | [string, Payload];

export const tokenName = (tok: Token): string => (typeof tok === 'string' ? tok : tok[0]);
export const tokenPayload = (tok: Token): Payload | undefined => (typeof tok === 'string' ? undefined : tok[1]);
export const isTupleToken = (tok: Token): tok is [string, Payload] => Array.isArray(tok);

const unicodeDashRegex = /[\u2012\u2013\u2014\u2015]/g;
const spacedSignRegex = /([+-])\s+(\d+)/g;
const bracketModifierRegex = /\[\s*(?<d1>[+-])(?<v1>\d+)(?:\s+or\s+(?<d2>[+-])(?<v2>\d+))?\s+(?<ct>Outsider|Minion)\s*\]/gi;
const punctuationRegex = /([,\.():])/g;
const starMarker = '__STAR__';

const pluralMap: Record<string, string> = {
    outsiders: 'outsider',
    minions: 'minion',
    players: 'player'
};

const normalizePlural = (word: string): string => pluralMap[word] ?? word;

const createBracketReplacement = (
    direction1: string,
    value1: string,
    direction2: string | undefined,
    value2: string | undefined,
    characterType: string
): string => {
    const payloadWords = ['accept_modifier', `${direction1}${value1}`];

    if (direction2 && value2) {
        payloadWords.push('or', `${direction2}${value2}`);
    }

    payloadWords.push(characterType.toLowerCase(), 'accept_modifier');
    return ` ${payloadWords.join(' ')} `;
};

export const normalizeText = (input: string): string => {
    if (!input) {
        return '';
    }

    let normalized = input.replace(unicodeDashRegex, '-');
    normalized = normalized.replace(spacedSignRegex, '$1$2');
    normalized = normalized.replace(bracketModifierRegex, (__match, ...rest) => {
        const groups = rest[rest.length - 1] as Record<string, string | undefined> | undefined;
        if (!groups?.d1 || !groups?.v1 || !groups?.ct) {
            return __match;
        }

        const direction1 = groups.d1;
        const value1 = groups.v1;
        const direction2 = groups.d2;
        const value2 = groups.v2;
        const characterType = groups.ct;

        return createBracketReplacement(direction1, value1, direction2, value2, characterType);
    });

    normalized = normalized.replace(/\*/g, ` ${starMarker} `);
    normalized = normalized.replace(punctuationRegex, ' ');
    normalized = normalized.replace(/\s+/g, ' '); // keep existing whitespace before lowercasing
    normalized = normalized.toLowerCase();
    normalized = normalized.replace(/__star__/g, starMarker);
    normalized = normalized.replace(/\[/g, ' accept_modifier ');
    normalized = normalized.replace(/\]/g, ' accept_modifier ');
    normalized = normalized.replace(/\s+/g, ' ').trim();

    return normalized;
};

export const tokenizeWords = (input: string): string[] => {
    if (!input) {
        return [];
    }

    return input
        .split(/\s+/)
        .map(normalizePlural)
        .filter((word) => word.length > 0);
};

export type LexRule = {
    name: string;
    phrase: string[];
    priority?: number;
};

export const defaultLexRules: LexRule[] = [
    { name: 'NOT_IN_PLAY', phrase: ['not', 'in', 'play'] },
    { name: 'IN_PLAY', phrase: ['in', 'play'] },
    { name: 'EACH_NIGHT', phrase: ['each', 'night'] },
    { name: 'AT_NIGHT', phrase: ['at', 'night'] },
    { name: 'ONCE_PER_GAME', phrase: ['once', 'per', 'game'] },
    { name: 'START_KNOWING', phrase: ['start', 'knowing'] },
    { name: 'AT_LEAST', phrase: ['at', 'least'] },
    { name: 'CHOOSE_DEAD_PLAYER', phrase: ['choose', 'dead', 'player'] },
    { name: 'CHOOSE_CHARACTER', phrase: ['choose', 'character'] },
    { name: 'CHOOSE_PLAYER', phrase: ['choose', 'player'] },
    { name: 'THEY_DIE', phrase: ['they', 'die'] },
    { name: 'NO_ABILITY', phrase: ['no', 'ability'] },
    { name: 'NO_EVIL', phrase: ['no', 'evil'] },
    { name: 'NO_DEMON', phrase: ['no', 'demon'] },
    { name: 'GOOD_PLAYER', phrase: ['good', 'player'] },
    { name: 'CHARACTER_TYPE_OUTSIDER', phrase: ['outsider'] },
    { name: 'CHARACTER_TYPE_MINION', phrase: ['minion'] },
    { name: 'ROLE_KING', phrase: ['king'] },
    { name: 'ROLE_DAMSEL', phrase: ['damsel'] },
    { name: 'OR', phrase: ['or'] },
    { name: 'ACCEPT_MODIFIER', phrase: ['accept_modifier'] }
];

export const applyLexRules = (words: string[], rules: LexRule[]): Token[] => {
    const normalized: Token[] = [];
    let index = 0;

    while (index < words.length) {
        let bestRule: LexRule | undefined;
        let bestLength = 0;
        let bestPriority = Number.NEGATIVE_INFINITY;

        for (const rule of rules) {
            if (rule.phrase.length === 0 || index + rule.phrase.length > words.length) {
                continue;
            }

            const matches = rule.phrase.every((word, offset) => words[index + offset] === word);
            if (!matches) {
                continue;
            }

            const priority = rule.priority ?? 0;
            if (
                rule.phrase.length > bestLength ||
                (rule.phrase.length === bestLength && priority > bestPriority)
            ) {
                bestRule = rule;
                bestLength = rule.phrase.length;
                bestPriority = priority;
            }
        }

        if (bestRule) {
            normalized.push(bestRule.name);
            index += bestLength;
            continue;
        }

        normalized.push(words[index]);
        index += 1;
    }

    return normalized;
};

const signedNumberRegex = /^[+-]\d+$/;
const digitsRegex = /^\d+$/;

const makeNumberValueToken = (op: 'add' | 'sub', value: number): Token => [
    'NUMBER_VALUE',
    { op, value }
];

const parseSignedNumberToken = (text: string): Token | null => {
    if (!signedNumberRegex.test(text)) {
        return null;
    }

    const op: 'add' | 'sub' = text.startsWith('+') ? 'add' : 'sub';
    const value = parseInt(text.slice(1), 10);

    return makeNumberValueToken(op, value);
};

export const applyNumericRules = (tokens: Token[]): Token[] => {
    const normalized: Token[] = [];

    for (let index = 0; index < tokens.length; index += 1) {
        const token = tokens[index];

        if (typeof token === 'string') {
            const signedNumber = parseSignedNumberToken(token);

            if (signedNumber) {
                normalized.push(signedNumber);
                continue;
            }

            if (digitsRegex.test(token)) {
                const next = tokens[index + 1];

                if (typeof next === 'string' && next === 'extra') {
                    const value = parseInt(token, 10);
                    normalized.push(makeNumberValueToken('add', value));
                    index += 1;
                    continue;
                }

                if (typeof next === 'string' && next === 'less') {
                    const value = parseInt(token, 10);
                    normalized.push(makeNumberValueToken('sub', value));
                    index += 1;
                    continue;
                }
            }
        }

        normalized.push(token);
    }

    return normalized;
};

type TokenPredicate = (tok: Token) => boolean;
type PatternStep = string | TokenPredicate;

interface PatternRule {
    name: string;
    pattern: PatternStep[];
}

const matchNumberValue = (op: 'add' | 'sub', value: number): TokenPredicate => (tok: Token) => {
    if (!isTupleToken(tok)) {
        return false;
    }

    if (tokenName(tok) !== 'NUMBER_VALUE') {
        return false;
    }

    const payload = tokenPayload(tok);
    return (
        typeof payload?.value === 'number' &&
        payload.value === value &&
        payload.op === op
    );
};

const defaultPatternRules: PatternRule[] = [
    { name: 'EACH_NIGHT_STAR', pattern: ['EACH_NIGHT', starMarker] },
    { name: 'AT_NIGHT_STAR', pattern: ['AT_NIGHT', starMarker] },
    {
        name: 'MIGHT_MODIFY_PLUS_OR_MINUS_ONE',
        pattern: [matchNumberValue('add', 1), 'OR', matchNumberValue('sub', 1)]
    },
    {
        name: 'MIGHT_MODIFY_PLUS_OR_MINUS_ONE',
        pattern: [matchNumberValue('sub', 1), 'OR', matchNumberValue('add', 1)]
    },
    {
        name: 'MIGHT_MODIFY_PLUS_ONE',
        pattern: ['might', matchNumberValue('add', 1)]
    },
    {
        name: 'MIGHT_MODIFY_PLUS_ONE',
        pattern: [matchNumberValue('add', 0), 'OR', matchNumberValue('add', 1)]
    }
];

const matchesPattern = (pattern: PatternStep[], tokens: Token[], start: number): boolean =>
    pattern.every((step, offset) => {
        const candidate = tokens[start + offset];

        if (candidate === undefined) {
            return false;
        }

        if (typeof step === 'string') {
            return candidate === step;
        }

        return step(candidate);
    });

export const applyPatternRules = (tokens: Token[], rules: PatternRule[]): Token[] => {
    // TODO: Capture metadata from these rewrites when we wire up the AST builder.
    const normalized: Token[] = [];

    let index = 0;

    while (index < tokens.length) {
        let matchedRule: PatternRule | undefined;

        for (const rule of rules) {
            if (index + rule.pattern.length > tokens.length) {
                continue;
            }

            if (matchesPattern(rule.pattern, tokens, index)) {
                matchedRule = rule;
                break;
            }
        }

        if (matchedRule) {
            normalized.push(matchedRule.name);
            index += matchedRule.pattern.length;
            continue;
        }

        normalized.push(tokens[index]);
        index += 1;
    }

    return normalized;
};

export interface TokenizeOptions {
    lexRules?: LexRule[];
    patternRules?: PatternRule[];
}

export const tokenize = (input: string, options?: TokenizeOptions): Token[] => {
    const normalizedText = normalizeText(input);
    const words = tokenizeWords(normalizedText);
    const lexed = applyLexRules(words, options?.lexRules ?? defaultLexRules);
    const numerics = applyNumericRules(lexed);
    return applyPatternRules(numerics, options?.patternRules ?? defaultPatternRules);
};

const formatToken = (tok: Token): string =>
    isTupleToken(tok) ? `${tokenName(tok)}(${JSON.stringify(tok[1])})` : tok;

const demoCases: Array<{
    label: string;
    input: string;
    expected: string[];
}> = [
    { label: 'NOT_IN_PLAY', input: 'not in play', expected: ['NOT_IN_PLAY'] },
    { label: 'IN_PLAY', input: 'in play', expected: ['IN_PLAY'] },
    { label: 'EACH_NIGHT_STAR', input: 'each night*', expected: ['EACH_NIGHT_STAR'] },
    { label: 'AT_NIGHT_STAR', input: 'at night*', expected: ['AT_NIGHT_STAR'] },
    {
        label: 'BRACKETED_SIMPLE',
        input: '[+1 Outsider] [-1 Outsider] [-1 Minion]',
        expected: [
            'ACCEPT_MODIFIER',
            'NUMBER_VALUE({"op":"add","value":1})',
            'CHARACTER_TYPE_OUTSIDER',
            'ACCEPT_MODIFIER',
            'ACCEPT_MODIFIER',
            'NUMBER_VALUE({"op":"sub","value":1})',
            'CHARACTER_TYPE_OUTSIDER',
            'ACCEPT_MODIFIER',
            'ACCEPT_MODIFIER',
            'NUMBER_VALUE({"op":"sub","value":1})',
            'CHARACTER_TYPE_MINION',
            'ACCEPT_MODIFIER'
        ]
    },
    {
        label: 'BRACKETED_OR_MINUS_OR_PLUS',
        input: '[-1 or +1 Outsider]',
        expected: ['ACCEPT_MODIFIER', 'MIGHT_MODIFY_PLUS_OR_MINUS_ONE', 'CHARACTER_TYPE_OUTSIDER', 'ACCEPT_MODIFIER']
    },
    {
        label: 'BRACKETED_OR_ZERO_ONE',
        input: '[+0 or +1 Outsider]',
        expected: ['ACCEPT_MODIFIER', 'MIGHT_MODIFY_PLUS_ONE', 'CHARACTER_TYPE_OUTSIDER', 'ACCEPT_MODIFIER']
    },
    {
        label: 'MIGHT_MODIFY',
        input: 'might +1 outsider',
        expected: ['MIGHT_MODIFY_PLUS_ONE', 'CHARACTER_TYPE_OUTSIDER']
    }
];

const runDemos = (): void => {
    demoCases.forEach((demo) => {
        const tokens = tokenize(demo.input);
        const rendered = tokens.map(formatToken);
        const matches =
            rendered.length === demo.expected.length &&
            rendered.every((value, index) => value === demo.expected[index]);

        console.log(`${demo.label}: ${demo.input} -> ${rendered.join(' | ')}`);
        console.assert(matches, `${demo.label} failed: ${JSON.stringify(rendered)}`);
    });
};

const entryPoint = process.argv[1]
    ? new URL(process.argv[1], `file://${process.cwd()}/`).href
    : undefined;

if (entryPoint && entryPoint === import.meta.url) {
    runDemos();
}
