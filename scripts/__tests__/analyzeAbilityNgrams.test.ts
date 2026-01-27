import { accumulateNgramCounts } from '../analyzeAbilityNgrams.ts';
import { tokenize, tokenName, tokenPayload, isTupleToken } from '../tokenPipeline.ts';

describe('tokenPipeline', () => {
    it('captures phrase tokens and keeps STAR markers', () => {
        const tokens = tokenize('Each night*, choose a player: they die.');
        const names = tokens.map(tokenName);
        expect(names).toEqual(['EACH_NIGHT_STAR', 'choose', 'a', 'player', 'THEY_DIE']);
    });

    it('desugars basic bracket modifiers to accept + number + type', () => {
        const tokens = tokenize('[+1 Outsider] [-1 Outsider] [-1 Minion]');
        expect(tokens.map(tokenName)).toEqual([
            'ACCEPT_MODIFIER',
            'NUMBER_VALUE',
            'CHARACTER_TYPE_OUTSIDER',
            'ACCEPT_MODIFIER',
            'ACCEPT_MODIFIER',
            'NUMBER_VALUE',
            'CHARACTER_TYPE_OUTSIDER',
            'ACCEPT_MODIFIER',
            'ACCEPT_MODIFIER',
            'NUMBER_VALUE',
            'CHARACTER_TYPE_MINION',
            'ACCEPT_MODIFIER'
        ]);

        const payloads = tokens
            .filter((tok): tok is [string, Record<string, unknown>] => isTupleToken(tok))
            .map((tok) => tokenPayload(tok));
        expect(payloads).toEqual([
            { op: 'add', value: 1 },
            { op: 'sub', value: 1 },
            { op: 'sub', value: 1 }
        ]);
    });

    it('detects might modifier +1 patterns', () => {
        const tokens = tokenize('might +1 outsider');
        expect(tokens.map(tokenName)).toEqual(['MIGHT_MODIFY_PLUS_ONE', 'CHARACTER_TYPE_OUTSIDER']);
    });

    it('coalesces +/-1 bracket modifiers into the mix pattern', () => {
        const tokens = tokenize('[-1 or +1 Outsider]');
        expect(tokens.map(tokenName)).toEqual([
            'ACCEPT_MODIFIER',
            'MIGHT_MODIFY_PLUS_OR_MINUS_ONE',
            'CHARACTER_TYPE_OUTSIDER',
            'ACCEPT_MODIFIER'
        ]);
    });
});

describe('analyzeAbilityNgrams accumulate helpers', () => {
    it('counts tokens, bigrams, and trigrams after stopword filtering', () => {
        const stopwords = new Set([
            'a',
            'an',
            'the',
            'and',
            'or',
            'to',
            'of',
            'on',
            'for',
            'with',
            'as',
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
            'no',
            'not',
            'at',
            'in'
        ]);

        const samples = [
            'Each night*, choose a player: they die.',
            'You start knowing [something].',
            'Each day, choose a player: they survive.'
        ];

        const tokenCounts: Record<string, number> = {};
        const bigramCounts: Record<string, number> = {};
        const trigramCounts: Record<string, number> = {};

        for (const sample of samples) {
            const tokens = tokenize(sample)
                .map(tokenName)
                .filter((token) => !stopwords.has(token));
            accumulateNgramCounts(tokens, tokenCounts, bigramCounts, trigramCounts);
        }

        expect(tokenCounts['EACH_NIGHT_STAR']).toBe(1);
        expect(tokenCounts['START_KNOWING']).toBe(1);
        expect(tokenCounts['ACCEPT_MODIFIER']).toBe(2);
        expect(bigramCounts['choose player']).toBe(2);
        expect(trigramCounts['choose player they']).toBe(2);
    });
});
