import type { LexRule, Payload } from './tokenPipeline';

const lexRules: LexRule[] = [
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

const ignored = [
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
];

type HandlerToken = string | [string, Payload];
type HandlerResult = HandlerToken | HandlerToken[] | Payload;

const regex: Record<string, [string, ((match: RegExpMatchArray) => HandlerResult | undefined) | undefined]> = {
    '/(.d*) extra': ['NUMBER', (match) => ({ value: match[0], op: '+' })]
};

const config = {
    lexRules,
    ignored,
    regex
};

export type NormalizationConfig = typeof config;

export default config;
