import { accumulateNgramCounts, tokenizeAbilityText, applyAliasSequences } from '../analyzeAbilityNgrams';

describe('analyzeAbilityNgrams helpers', () => {
    it('tokenizes ability text, keeps STAR, and filters stopwords', () => {
        const { tokens, stopwordCount } = tokenizeAbilityText('Each night*, choose a player: they die.');
        expect(tokens).toEqual(['each', 'night', 'STAR', 'choose', 'player', 'they', 'die']);
        expect(stopwordCount).toBe(1);
    });

    it('inserts ACCEPT_MODIFIER tokens for brackets and removes punctuation', () => {
        const { tokens } = tokenizeAbilityText('You start knowing [something].');
        expect(tokens).toEqual(['start', 'knowing', 'ACCEPT_MODIFIER', 'something', 'ACCEPT_MODIFIER']);
    });

    it('applies alias sequences to collapse known bigrams', () => {
        const { tokens } = tokenizeAbilityText('Each night*, choose a player: they die.');
        const sequences = [
            { alias: 'EACH_NIGHT', sequence: ['each', 'night'] }
        ];
        const aliased = applyAliasSequences(tokens, sequences);
        expect(aliased).toEqual(['EACH_NIGHT', 'STAR', 'choose', 'player', 'they', 'die']);
    });

    it('counts bigrams and trigrams across several ability texts', () => {
        const tokenCounts: Record<string, number> = {};
        const bigramCounts: Record<string, number> = {};
        const trigramCounts: Record<string, number> = {};

        const samples = [
            'Each night*, choose a player: they die.',
            'You start knowing [something].',
            'Each day, choose a player: they survive.'
        ];

        for (const sample of samples) {
            const { tokens } = tokenizeAbilityText(sample);
            accumulateNgramCounts(tokens, tokenCounts, bigramCounts, trigramCounts);
        }

        expect(tokenCounts['each']).toBe(2);
        expect(tokenCounts['STAR']).toBe(1);
        expect(tokenCounts['ACCEPT_MODIFIER']).toBe(2);
        expect(bigramCounts['choose player']).toBe(2);
        expect(trigramCounts['choose player they']).toBe(2);
    });
});
