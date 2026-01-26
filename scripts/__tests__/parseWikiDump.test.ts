import { cleanText, findAbilityLine, parseCategories, parseJinxes } from '../parseWikiDump';

describe('parseWikiDump helpers', () => {
    const summaryBody = '"Each night*, choose a player: if they are drunk, you die."\n\nThe Acrobat dies when they find a drunk or poisoned player.';
    const jinxWikitext = '{{Jinx|Assassin|assassin|Evil|If you die, the Assassin dies.}}\n{{Jinx|Sailor||Good|The Sailor dies with you.}}\n[[Category:Experimental Characters]]\n[[Category:Townsfolk]]';

    it('extracts the ability text and remainder from the summary', () => {
        const { abilityLine, summaryRest } = findAbilityLine(summaryBody);
        expect(cleanText(abilityLine)).toBe('Each night*, choose a player: if they are drunk, you die.');
        expect(cleanText(summaryRest)).toContain('The Acrobat dies when they find a drunk or poisoned player.');
    });

    it('parses categories out of the wikitext', () => {
        const categories = parseCategories(jinxWikitext);
        expect(categories).toEqual(['Experimental Characters', 'Townsfolk']);
    });

    it('reads jinx templates with alignment and fallback keys', () => {
        const jinxes = parseJinxes(jinxWikitext);
        expect(jinxes).toEqual([
            {
                with: 'Assassin',
                withKey: 'assassin',
                alignment: 'Evil',
                text: 'If you die, the Assassin dies.'
            },
            {
                with: 'Sailor',
                withKey: 'sailor',
                alignment: 'Good',
                text: 'The Sailor dies with you.'
            }
        ]);
    });
});
