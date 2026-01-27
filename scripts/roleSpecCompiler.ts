import fs from 'node:fs/promises';
import path from 'node:path';
import { infoKind, resolveKind, rulesKind, triggerKind, winCheckKind } from '../src/spec/stKinds.ts';
import type { JinxEntry, NormalizedWikiPage, RoleRecord } from '../src/spec/wikiTypes.ts';

type RoleCategory = 'townsfolk' | 'outsider' | 'minion' | 'demon' | 'traveller' | 'fabled' | 'loric' | 'experimental';

type NightOrderWhen = 'firstNight' | 'otherNights' | 'everyNight';

interface SetupModificationBase {
    evidence: string[];
}

type SetupModificationSpec =
    | (SetupModificationBase & {
          kind: 'ADD_ROLE_COUNT';
          target: 'outsider' | 'minion' | 'townsfolk';
          delta: number;
          reason?: string;
      })
    | (SetupModificationBase & {
          kind: 'REPLACE_TOKEN_IN_BAG';
          removeRoleKey: string;
          addRoleKey: string;
          secrecy: 'public' | 'st_only';
          reason?: string;
      })
    | (SetupModificationBase & {
          kind: 'ASSIGN_MASKED_ROLE';
          maskedSeat: 'self' | { seatSelector: string };
          shownRoleKey: string;
          trueRoleKey: string;
          reason?: string;
      })
    | (SetupModificationBase & {
          kind: 'SETUP_CONSTRAINT';
          constraintKey: string;
          payload?: unknown;
          reason?: string;
      })
    | (SetupModificationBase & {
          kind: 'START_KNOWING';
          recipients: 'self' | 'team_evil' | 'custom';
          payload: unknown;
          reason?: string;
      });

interface PassiveAbilityBase {
    evidence: string[];
}

type PassiveAbilitySpec =
    | (PassiveAbilityBase & {
          kind: 'REGISTRATION_MODIFIER';
          registersAs: Array<'evil' | 'good' | 'demon' | 'minion' | 'townsfolk' | 'outsider' | { roleKey: string }>;
          scope: 'always' | 'sometimes' | 'st_decides';
          notes?: string;
      })
    | (PassiveAbilityBase & {
          kind: 'DEATH_PREVENTION';
          cause: 'demon_kill' | 'execution' | 'any';
          scope: 'self' | 'neighbors' | 'team' | 'targeted';
          resolution: 'st_request' | 'automatic';
      })
    | (PassiveAbilityBase & {
          kind: 'GLOBAL_RULE';
          ruleKey: string;
          activeWhile: 'alive' | 'in_play';
          resolution: 'st_request' | 'automatic';
      })
    | (PassiveAbilityBase & {
          kind: 'INFO_DISTORTION';
          affects: 'self' | 'targets';
          policy: 'unreliable' | 'false' | 'blocked';
          resolution: 'st_request';
      });

interface NightOrderStepSpec {
    when: NightOrderWhen;
    blocksNight: boolean;
    description: string;
    evidence: string[];
}

interface OnMomentSpec {
    moment: string;
    description: string;
    evidence: string[];
}

type EffectType =
    | 'requestChoice'
    | 'requestInfo'
    | 'applyEffect'
    | 'removeEffect'
    | 'killAttempt'
    | 'preventDeath'
    | 'redirectDeath'
    | 'modifySetup'
    | 'modifyRegistration'
    | 'modifyVote'
    | 'endGame';

interface ActiveAbilityIntent {
    requestChoice?: {
        targetCount?: number;
        description?: string;
    };
    note?: string;
}

interface ActiveAbilityResolution {
    stKind: string;
    description: string;
    effectType: EffectType;
    emitEvent?: string;
}

interface ActiveAbilitySpend {
    marksNoAbilityEffect?: boolean;
}

interface ActiveAbilitySpec {
    kind: 'night_action' | 'day_claim' | 'other';
    usage: string;
    description: string;
    intent?: ActiveAbilityIntent;
    resolution: ActiveAbilityResolution;
    spend?: ActiveAbilitySpend;
    evidence: string[];
}
   
interface RoleTagSpec {
    isInfoRole: boolean;
    isSetupModifier: boolean;
    actsAtNight: boolean;
    actsByClaim: boolean;
    hasRoleSwap: boolean;
    hasAlignmentSwap: boolean;
    hasRegistrationWeirdness: boolean;
    isGlobalRule: boolean;
}

interface RoleSpec {
    roleKey: string;
    title: string;
    category: RoleCategory;
    editionTags: string[];
    abilityText: string;
    summary: string;
    howToRun?: string;
    examples?: string[];
    setupModifications: SetupModificationSpec[];
    nightOrderSteps: NightOrderStepSpec[];
    onMoments: OnMomentSpec[];
    passiveAbilities: PassiveAbilitySpec[];
    activeAbilities: ActiveAbilitySpec[];
    jinxes: JinxEntry[];
    tags: RoleTagSpec;
    stKinds: string[];
    todos?: string[];
    factTags?: string[];
}

interface CompilerConfig {
    phraseThresholds?: Partial<Record<'nightAction' | 'dayClaim', number>>;
    forcedOverrides?: Record<string, Partial<RoleSpec>>;
}

interface CompilerReport {
    rolesProcessed: number;
    rolesWithActiveAbilities: number;
    rolesWithTodos: number;
    commonTodos: Record<string, number>;
}

interface NgramIndex {
    normalizedKeys: string[];
    tokenCounts: Record<string, number>;
    tokensByRole: Map<string, string[]>;
}

interface CompilerOptions {
    recordsPath: string;
    pagesDir: string;
    ngramDir: string;
    configPath?: string;
    outputDir: string;
}

const CATEGORY_MAP: Record<string, RoleCategory> = {
    townsfolk: 'townsfolk',
    outsider: 'outsider',
    minion: 'minion',
    demon: 'demon',
    traveller: 'traveller',
    traveler: 'traveller',
    fabled: 'fabled',
    loric: 'loric',
    experimental: 'experimental'
};

const DEFAULT_PHRASE_THRESHOLDS: Record<'nightAction' | 'dayClaim', number> = {
    nightAction: 1,
    dayClaim: 1
};

const DEFAULT_CONFIG_PATH = path.resolve('compilerConfig.json');

const DEFAULT_OPTIONS: CompilerOptions = {
    recordsPath: path.resolve('eidolon_wiki_parsed', 'roleRecords.json'),
    pagesDir: path.resolve('eidolon_wiki_parsed', 'pages'),
    ngramDir: path.resolve('eidolon_ngrams'),
    outputDir: path.resolve('roleSpecs')
};

const NUMBER_WORDS: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10
};

const NIGHT_PHRASES = [
    'each night',
    'every night',
    'wake each night',
    'nightly',
    'during the night',
    'first night',
    'at night',
    'every night except the first',
    'night except the first'
];

const DAY_CLAIM_PHRASES = [
    'during the day',
    'each day',
    'publicly choose',
    'public guess',
    'day claim',
    'declare during the day',
    'publicly guess',
    'public guess which players'
];

const GLOBAL_RULE_PHRASES = [
    'good wins',
    'evil wins',
    'good loses',
    'evil loses',
    'good team wins',
    'evil team wins',
    'the good team wins',
    'the evil team wins',
    'good wins immediately',
    'evil wins immediately'
];

const START_KNOWING_PHRASES = [
    'start knowing',
    'you start knowing',
    'start the game knowing',
    'starts knowing',
    'begin the game knowing',
    'start the game with knowledge',
    'start with knowledge'
];

const REGISTER_PHRASES = ['register as', 'registers as', 'register as drunk', 'registers as drunk'];

const ROLE_CHANGE_PHRASES = ['becomes evil', 'becomes the demon', 'become evil', 'become the demon'];

const DEATH_MOMENT_PHRASES = [
    'if you die',
    'when you die',
    'if you would die',
    'upon death',
    'if you die for any reason',
    'if you died'
];

const DEATH_PREVENTION_PHRASES = ['cannot die', 'does not die', 'you do not die'];

const ST_DISCRETION_PHRASES = [
    'storyteller may',
    'storyteller might',
    'optional rule',
    'if you feel',
    'you may need to',
    'storyteller chooses',
    'you may choose to',
    'the storyteller decides'
];

const NIGHT_ACTION_ROLES = new Set([
    'spy',
    'poisoner',
    'scarletwoman',
    'imp',
    'butler',
    'washerwoman',
    'chef',
    'librarian',
    'investigator',
    'monk',
    'fortuneteller',
    'undertaker',
    'ravenkeeper'
]);

const FIRST_NIGHT_ONLY_ROLES = new Set(['washerwoman', 'chef', 'librarian', 'investigator']);
const EVERY_NIGHT_EXCEPT_FIRST_ROLES = new Set(['imp', 'scarletwoman', 'ravenkeeper', 'undertaker']);
const EVERY_NIGHT_ROLES = new Set(['poisoner', 'monk', 'butler', 'fortuneteller', 'empath']);
const MAKE_CHOICE_ROLES = new Set(['fortuneteller', 'monk', 'butler', 'poisoner', 'slayer', 'ravenkeeper']);
const PROTECTION_ROLES = new Set(['monk', 'soldier', 'mayor']);
const VOTING_RESTRICTION_ROLES = new Set(['butler']);
const SETUP_MODIFIER_ROLES = new Set(['drunk', 'baron']);
const MASKING_ROLES = new Set(['drunk']);
const ATTEMPTED_EXECUTION_ROLES = new Set(['saint', 'virgin']);
const CHECK_REGISTRATION_ROLES = new Set(['virgin', 'empath', 'chef']);
const DEMON_DEATH_CHECKS = new Set(['imp', 'soldier', 'monk']);
const WIN_CONDITION_ROLES = new Set(['saint', 'imp']);
const ALIVE_CONDITIONAL_ROLES = new Set(['monk']);
const ONGOING_INFO_ROLES = new Set(['fortuneteller', 'undertaker', 'empath']);
const ONE_TIME_INFO_ROLES = new Set(['ravenkeeper']);
const ACTIVE_ABILITY_ROLES = new Set(['slayer']);
const PROTECTION_TAGGED_ROLES = new Set(['monk', 'soldier', 'mayor']);
const MISREGISTRATION_ROLES = new Set(['spy', 'recluse']);
const NIGHT_ROLE_GROUP_FACTS: Array<[Set<string>, string]> = [
    [MASKING_ROLES, 'masking'],
    [SETUP_MODIFIER_ROLES, 'setup-modifier'],
    [ONGOING_INFO_ROLES, 'ongoing-info'],
    [ONE_TIME_INFO_ROLES, 'one-time-info'],
    [ACTIVE_ABILITY_ROLES, 'active-ability'],
    [PROTECTION_TAGGED_ROLES, 'protection'],
    [VOTING_RESTRICTION_ROLES, 'voting-restriction'],
    [ATTEMPTED_EXECUTION_ROLES, 'execution-trigger'],
    [CHECK_REGISTRATION_ROLES, 'registration-check'],
    [MAKE_CHOICE_ROLES, 'makes-choice'],
    [DEMON_DEATH_CHECKS, 'demon-death-check'],
    [WIN_CONDITION_ROLES, 'win-condition'],
    [ALIVE_CONDITIONAL_ROLES, 'alive-cond']
];

const ROLE_EFFECT_OVERRIDES: Record<string, EffectType> = {
    fortuneteller: 'requestInfo',
    undertaker: 'requestInfo',
    empath: 'requestInfo',
    ravenkeeper: 'requestInfo',
    monk: 'preventDeath',
    butler: 'modifyVote',
    poisoner: 'killAttempt',
    slayer: 'killAttempt',
    imp: 'killAttempt',
    soldier: 'killAttempt',
    mayor: 'modifyVote'
};

const EFFECT_EMIT_EVENTS: Record<string, string> = {
    imp: 'ATTEMPTED_DEATH'
};
const INFO_DISTORTION_PHRASES = [
    'false information',
    'false info',
    'unreliable information',
    'gives false',
    'gives unreliable',
    'may give false',
    'information is wrong',
    'information is unreliable',
    'inaccurate information'
];

const ROLE_COUNT_MAP: Record<string, 'outsider' | 'minion' | 'townsfolk'> = {
    outsider: 'outsider',
    outsiders: 'outsider',
    minion: 'minion',
    minions: 'minion',
    townsfolk: 'townsfolk',
    townfolk: 'townsfolk'
};

const REGISTER_TARGET_MAP: Record<string, 'evil' | 'good' | 'demon' | 'minion' | 'townsfolk' | 'outsider'> = {
    evil: 'evil',
    good: 'good',
    demon: 'demon',
    minion: 'minion',
    townsfolk: 'townsfolk',
    outsider: 'outsider'
};

const REGISTER_TARGET_REGEX = /registers? as (?:a |an )?([a-z][a-z0-9_]+)/gi;
const REGISTER_SCOPE_REGEX = /\b(may|might)\s+registers?\b/i;

const MASKED_ROLE_PHRASES = [
    'you think you are',
    'you think you are a',
    'you do not know you are',
    'secretly the',
    'hidden',
    'pretends that you are',
    'masquerade',
    'think you are the',
    'is the drunk reminder',
    'token does not go in the bag',
    'add a townsfolk character token',
    'put the swapped townsfolk character token in the bag'
];

function parseCliArgs(argv: string[]): CompilerOptions {
    const args = [...argv];
    const getValue = (flag: string): string | undefined => {
        const index = args.indexOf(flag);
        if (index === -1 || index === args.length - 1) {
            return undefined;
        }
        const value = args[index + 1];
        args.splice(index, 2);
        return value;
    };

    if (args.includes('--help') || args.includes('-h')) {
        printUsage();
        process.exit(0);
    }

    const recordsPath = getValue('--records') ?? DEFAULT_OPTIONS.recordsPath;
    const pagesDir = getValue('--pages') ?? DEFAULT_OPTIONS.pagesDir;
    const ngramDir = getValue('--ngrams') ?? DEFAULT_OPTIONS.ngramDir;
    const configPath = getValue('--config');
    const outputDir = getValue('--out') ?? DEFAULT_OPTIONS.outputDir;

    return {
        recordsPath: path.resolve(recordsPath),
        pagesDir: path.resolve(pagesDir),
        ngramDir: path.resolve(ngramDir),
        configPath: configPath ? path.resolve(configPath) : undefined,
        outputDir: path.resolve(outputDir)
    };
}

function printUsage(): void {
    process.stdout.write(`
Usage: tsx scripts/roleSpecCompiler.ts [options]

Options:
  --records <path>    Path to roleRecords.json (default: eidolon_wiki_parsed/roleRecords.json)
  --pages <path>      Directory containing normalized pages (default: eidolon_wiki_parsed/pages)
  --ngrams <path>     Directory containing ability bigrams/trigrams/token counts (default: eidolon_ngrams)
  --config <path>     Optional compilerConfig.json
  --out <path>        Output directory for role specs (default: roleSpecs)
  -h, --help          Display this help message
`);
}

const normalizePhrase = (value: string): string =>
    value.replace(/\*/g, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

const normalizeNgramKey = (value: string): string => value.replace(/_/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();

async function loadJsonFile<T>(filePath: string): Promise<T> {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
}

async function loadNgrams(dir: string): Promise<NgramIndex> {
    const bigrams = await loadJsonFile<Record<string, number>>(path.join(dir, 'ability_bigrams.json'));
    const trigrams = await loadJsonFile<Record<string, number>>(path.join(dir, 'ability_trigrams.json'));
    const tokenCounts = await loadJsonFile<Record<string, number>>(path.join(dir, 'ability_token_counts.json'));
    const tokenizedFilePath = path.join(dir, 'tb_ability_tokenized_texts.json');
    let tokenizedEntries: Array<{ roleKey: string; tokens: string[] }> = [];

    try {
        tokenizedEntries = await loadJsonFile<typeof tokenizedEntries>(tokenizedFilePath);
    } catch {
        console.warn(`[roleSpecCompiler] Missing tokenized ability data at ${tokenizedFilePath}`);
    }

    const normalizedKeys = Array.from(
        new Set([...Object.keys(bigrams).map(normalizeNgramKey), ...Object.keys(trigrams).map(normalizeNgramKey)])
    );

    const tokensByRole = new Map<string, string[]>();
    for (const entry of tokenizedEntries) {
        if (!entry || typeof entry !== 'object') {
            continue;
        }
        const { roleKey, tokens } = entry as { roleKey: unknown; tokens: unknown };
        if (typeof roleKey !== 'string' || !Array.isArray(tokens)) {
            continue;
        }
        tokensByRole.set(
            roleKey,
            tokens.filter((token) => typeof token === 'string').map((token) => token.toLowerCase())
        );
    }

    return {
        normalizedKeys,
        tokenCounts,
        tokensByRole
    };
}

async function loadPages(dir: string): Promise<Map<string, NormalizedWikiPage>> {
    const files = await fs.readdir(dir);
    const map = new Map<string, NormalizedWikiPage>();

    for (const file of files) {
        if (!file.toLowerCase().endsWith('.json')) {
            continue;
        }
        const resolved = path.join(dir, file);
        try {
            const page = await loadJsonFile<NormalizedWikiPage>(resolved);
            if (page && page.roleKey) {
                map.set(page.roleKey, page);
            }
        } catch {
            console.warn(`[roleSpecCompiler] Failed to parse normalized page ${file}`);
        }
    }

    return map;
}

async function loadRecords(filePath: string): Promise<RoleRecord[]> {
    const records = await loadJsonFile<RoleRecord[]>(filePath);
    return Array.isArray(records) ? records : [];
}

function determineCategory(record: RoleRecord, page?: NormalizedWikiPage): RoleCategory {
    const hint = (record.categoryHint ?? page?.categoryHint ?? '').toLowerCase();
    for (const [key, value] of Object.entries(CATEGORY_MAP)) {
        if (!key) {
            continue;
        }
        if (hint.includes(key)) {
            return value;
        }
    }
    if (page?.categories?.length) {
        for (const candidate of page.categories) {
            const normalized = candidate.toLowerCase();
            const match = Object.entries(CATEGORY_MAP).find(([key]) => normalized.includes(key));
            if (match) {
                return match[1];
            }
        }
    }
    return 'experimental';
}

function buildPhraseChecker(normalizedText: string, tokens: string[]): (phrase: string) => { hit: boolean; evidence: string } {
    const normalizedTokens = tokens.map((token) => token.toLowerCase());

    const containsTokens = (phraseWords: string[]): boolean => {
        if (!phraseWords.length || !normalizedTokens.length) {
            return false;
        }
        for (let idx = 0; idx <= normalizedTokens.length - phraseWords.length; idx++) {
            let matched = true;
            for (let offset = 0; offset < phraseWords.length; offset++) {
                if (normalizedTokens[idx + offset] !== phraseWords[offset]) {
                    matched = false;
                    break;
                }
            }
            if (matched) {
                return true;
            }
        }
        return false;
    };

    return (phrase: string) => {
        const normalized = normalizePhrase(phrase);
        if (!normalized) {
            return { hit: false, evidence: phrase };
        }
        const phraseWords = normalized.split(/\s+/).filter(Boolean);
        if (containsTokens(phraseWords)) {
            return { hit: true, evidence: `${phrase} (tokens)` };
        }
        if (normalizedText.includes(normalized)) {
            return { hit: true, evidence: `${phrase} (text)` };
        }
        return { hit: false, evidence: phrase };
    };
}

function collectMatches(phrases: string[], checker: (phrase: string) => { hit: boolean; evidence: string }): string[] {
    const matches: string[] = [];
    for (const phrase of phrases) {
        const { hit, evidence } = checker(phrase);
        if (hit) {
            matches.push(evidence);
        }
    }
    return matches;
}

function detectRoleCountChanges(text: string): Array<{ target: 'outsider' | 'minion' | 'townsfolk'; delta: number; evidence: string; reason?: string }> {
    const changes: Array<{ target: 'outsider' | 'minion' | 'townsfolk'; delta: number; evidence: string; reason?: string }> = [];
    const pushChange = (targetRaw: string, delta: number, evidence: string, reason?: string) => {
        const normalized = ROLE_COUNT_MAP[targetRaw.toLowerCase()];
        if (!normalized || delta === 0) {
            return;
        }
        changes.push({ target: normalized, delta, evidence, reason });
    };

    const bracketRegex = /\[\s*([+-]?\d+)\s*(outsiders?|minions?|townsfolk)s?\s*\]/gi;
    let match: RegExpExecArray | null;
    while ((match = bracketRegex.exec(text))) {
        pushChange(match[2], Number(match[1]), `${match[0].trim()} (text)`, 'explicit bracket note');
    }

    const addRegex = /add(?: any)? (\d+)\s*(outsiders?|minions?|townsfolk)s?/gi;
    while ((match = addRegex.exec(text))) {
        pushChange(match[2], Number(match[1]), `${match[0].trim()} (text)`, 'setup addition described');
    }

    const removeRegex = /remove(?: any)? (\d+)\s*(outsiders?|minions?|townsfolk)s?/gi;
    while ((match = removeRegex.exec(text))) {
        pushChange(match[2], -Number(match[1]), `${match[0].trim()} (text)`, 'setup removal described');
    }

    return changes;
}

function detectRegistrationTargets(text: string): Array<'evil' | 'good' | 'demon' | 'minion' | 'townsfolk' | 'outsider' | { roleKey: string }> {
    const targets: Array<'evil' | 'good' | 'demon' | 'minion' | 'townsfolk' | 'outsider' | { roleKey: string }> = [];
    const seen = new Set<string>();
    let match: RegExpExecArray | null;
    while ((match = REGISTER_TARGET_REGEX.exec(text))) {
        const raw = match[1].toLowerCase();
        const normalized = raw.replace(/[^a-z0-9_]/g, '');
        if (!normalized) {
            continue;
        }
        const mapped = REGISTER_TARGET_MAP[normalized];
        const entry = mapped ? mapped : { roleKey: normalized };
        const key = typeof entry === 'string' ? entry : `roleKey:${entry.roleKey}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);
        targets.push(entry);
    }
    return targets;
}

function parseTargetCount(text: string): number | undefined {
    const normalized = text.toLowerCase();
    const match = normalized.match(
        /choose\s+(?:up to\s+)?(?:any\s+)?(?:(\d+)|one|two|three|four|five|six|seven|eight|nine|ten)/
    );
    if (!match) {
        return undefined;
    }
    const [, numeric] = match;
    if (numeric) {
        return Number(numeric);
    }
    const word = match[0].match(/one|two|three|four|five|six|seven|eight|nine|ten/);
    if (word) {
        return NUMBER_WORDS[word[0]] ?? undefined;
    }
    return undefined;
}

function describeSnip(text: string, limit = 160): string {
    const excerpt = text.replace(/\s+/g, ' ').trim();
    if (excerpt.length <= limit) {
        return excerpt;
    }
    return `${excerpt.slice(0, limit).trim()}…`;
}

function buildRoleSpec(
    record: RoleRecord,
    page: NormalizedWikiPage | undefined,
    ngramIndex: NgramIndex,
    thresholds: Record<'nightAction' | 'dayClaim', number>
): RoleSpec {
    const abilityText = page?.abilityText ?? record.abilityText ?? '';

    const sectionText = [
        page?.sections?.summary,
        page?.sections?.how_to_run,
        ...(page?.sections?.examples ?? [])
    ]
        .filter(Boolean)
        .join(' ');

    const combinedTextBase = [
        abilityText,
        record.summary,
        record.howToRun,
        sectionText
    ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();

    const otherSectionsText =
        page && page.otherSections
            ? Object.values(page.otherSections)
                .filter(Boolean)
                .join(' ')
                .replace(/\s+/g, ' ')
                .toLowerCase()
            : '';

    const combinedText = combinedTextBase;
    const startText = [combinedTextBase, otherSectionsText].filter(Boolean).join(' ').trim();
    const roleTokens = ngramIndex.tokensByRole.get(record.roleKey) ?? [];

    const checker = buildPhraseChecker(combinedText, roleTokens);
    const startChecker = buildPhraseChecker(startText, roleTokens);

    const nightMatches = collectMatches(NIGHT_PHRASES, checker);
    const dayMatches = collectMatches(DAY_CLAIM_PHRASES, checker);
    const roleCountText = [
        abilityText,
        record.summary,
        record.howToRun,
        page?.sections?.how_to_run,
        page?.howToRun,
        page?.sections?.summary
    ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .toLowerCase();
    const roleCountChanges = detectRoleCountChanges(roleCountText);

    const maskMatches = collectMatches(MASKED_ROLE_PHRASES, startChecker);
    const maskDetected = maskMatches.length > 0;
    const startKnowingMatches = maskDetected ? [] : collectMatches(START_KNOWING_PHRASES, startChecker);

    const registerMatches = collectMatches(REGISTER_PHRASES, checker);
    const registerTargets = detectRegistrationTargets(combinedText);
    const registerScope = REGISTER_SCOPE_REGEX.test(combinedText) ? 'sometimes' : 'always';
    const infoDistortionMatches = collectMatches(INFO_DISTORTION_PHRASES, checker);
    const roleChangeMatches = collectMatches(ROLE_CHANGE_PHRASES, checker);
    const deathMomentMatches = collectMatches(DEATH_MOMENT_PHRASES, checker);
    const deathPreventionMatches = collectMatches(DEATH_PREVENTION_PHRASES, checker);
    const globalRuleMatches = collectMatches(GLOBAL_RULE_PHRASES, checker);
    const stDiscretionMatches = collectMatches(ST_DISCRETION_PHRASES, checker);

    const hasNightPhrases = nightMatches.length >= thresholds.nightAction;
    const hasDayPhrases = dayMatches.length >= thresholds.dayClaim;

    const isNightAction = record.signals?.eachNight || hasNightPhrases;
    const actsDuringDay = record.signals?.eachDay || hasDayPhrases;
    const usage =
        checker('once per game').hit || checker('one per game').hit ? 'once_per_game'
        : checker('first night only').hit || checker('on the first night').hit ? 'first_night'
        : actsDuringDay ? 'each_day'
        : isNightAction ? 'each_night'
        : 'variable';

    const targetCount = parseTargetCount(abilityText);
    const intent: ActiveAbilityIntent | undefined =
        targetCount ?
            {
                requestChoice: {
                    targetCount,
                    description: `Choose ${targetCount} player${targetCount === 1 ? '' : 's'}`
                }
            }
        : record.signals?.choose ?
            {
                requestChoice: {
                    targetCount: 1,
                    description: 'Choose a player'
                }
            }
        :   undefined;

    const activeEvidence = new Set<string>();
    [...nightMatches, ...dayMatches].forEach((entry) => activeEvidence.add(entry));
    if (intent?.requestChoice?.description) {
        activeEvidence.add('choose (inferred)');
    }

    const hasActive =
        Boolean(intent) ||
        record.signals?.choose ||
        record.signals?.oncePerGame ||
        record.signals?.eachNight ||
        record.signals?.eachDay;

    const activeAbilities: ActiveAbilitySpec[] = [];
    if (hasActive) {
        const kind =
            actsDuringDay ? 'day_claim'
            : isNightAction ? 'night_action'
            : 'other';
        const description = describeSnip(abilityText);
        const effectType = ROLE_EFFECT_OVERRIDES[record.roleKey] ?? 'applyEffect';
        const emitEvent = EFFECT_EMIT_EVENTS[record.roleKey];
        const ability: ActiveAbilitySpec = {
            kind,
            usage,
            description,
            resolution: {
                stKind: resolveKind(record.roleKey, 'action'),
                description: `Resolve ${record.roleKey} ${kind.replace('_', ' ')}`,
                effectType,
                ...(emitEvent ? { emitEvent } : {})
            },
            evidence: Array.from(activeEvidence)
        };

        if (intent) {
            ability.intent = intent;
        }

        if (usage === 'once_per_game') {
            ability.spend = {
                marksNoAbilityEffect: true
            };
        }

        activeAbilities.push(ability);
    }

    const passiveAbilities: PassiveAbilitySpec[] = [];
    if (registerMatches.length || registerTargets.length || MISREGISTRATION_ROLES.has(record.roleKey)) {
        const registersAs = registerTargets.length ? registerTargets : ['townsfolk'];
        passiveAbilities.push({
            kind: 'REGISTRATION_MODIFIER',
            registersAs,
            scope: registerScope,
            notes: registerMatches.length ? undefined : 'Registration target inferred from context.',
            evidence: registerMatches.length
                ? registerMatches
                : MISREGISTRATION_ROLES.has(record.roleKey)
                    ? ['misregistration fact list']
                    : ['registration pattern detected (text)']
        });
    }
    if (deathPreventionMatches.length) {
        const hasExecution = /execution/i.test(combinedText);
        const hasDemonKill = /\bdemon\b/.test(combinedText);
        const cause = hasExecution ? 'execution' : hasDemonKill ? 'demon_kill' : 'any';
        const resolution = /storyteller may/i.test(combinedText) ? 'st_request' : 'automatic';
        passiveAbilities.push({
            kind: 'DEATH_PREVENTION',
            cause,
            scope: 'self',
            resolution,
            evidence: deathPreventionMatches
        });
    }
    if (globalRuleMatches.length) {
        passiveAbilities.push({
            kind: 'GLOBAL_RULE',
            ruleKey: record.roleKey.toUpperCase(),
            activeWhile: 'alive',
            resolution: 'automatic',
            evidence: globalRuleMatches
        });
    }
    if (WIN_CONDITION_ROLES.has(record.roleKey) && !globalRuleMatches.length) {
        passiveAbilities.push({
            kind: 'GLOBAL_RULE',
            ruleKey: `${record.roleKey.toUpperCase()}_WIN`,
            activeWhile: 'alive',
            resolution: 'automatic',
            evidence: ['win condition list (fact)']
        });
    }
    if (infoDistortionMatches.length) {
        passiveAbilities.push({
            kind: 'INFO_DISTORTION',
            affects: 'self',
            policy: 'false',
            resolution: 'st_request',
            evidence: infoDistortionMatches
        });
    }

    const onMoments: OnMomentSpec[] = [];
    if (deathMomentMatches.length) {
        onMoments.push({
            moment: 'MOMENT_DEATH_RESOLVED',
            description: 'Something happens when this character dies.',
            evidence: deathMomentMatches
        });
    }
    if (roleChangeMatches.length) {
        onMoments.push({
            moment: 'ROLE_CHANGED',
            description: 'Alignment or role status can change.',
            evidence: roleChangeMatches
        });
    }
    if (ATTEMPTED_EXECUTION_ROLES.has(record.roleKey)) {
        onMoments.push({
            moment: 'MOMENT_ATTEMPTED_EXECUTION',
            description: 'Special consequences when the character is executed.',
            evidence: ['attempted execution list (fact)']
        });
    }
    if (CHECK_REGISTRATION_ROLES.has(record.roleKey)) {
        onMoments.push({
            moment: 'MOMENT_REGISTRATION_CHECKED',
            description: 'Storyteller validates this character during registration.',
            evidence: ['registration check list (fact)']
        });
    }
    if (DEMON_DEATH_CHECKS.has(record.roleKey)) {
        onMoments.push({
            moment: 'MOMENT_DEMON_DEATH_RESOLVED',
            description: 'Triggers when the Demon dies or is revealed.',
            evidence: ['demon death check list (fact)']
        });
    }
    if (ALIVE_CONDITIONAL_ROLES.has(record.roleKey)) {
        onMoments.push({
            moment: 'MOMENT_PLAYERS_ALIVE_CHANGED',
            description: 'Rules change depending on how many players are alive.',
            evidence: ['alive conditional list (fact)']
        });
    }

    const setupModifications: SetupModificationSpec[] = [];
    if (maskDetected) {
        const combinedLower = startText.toLowerCase();
        const shownRoleKey =
            combinedLower.includes('townsfolk') || combinedLower.includes('townsfolk character') ? 'townsfolk' :
            combinedLower.includes('outsider') ? 'outsider' :
            combinedLower.includes('minion') ? 'minion' :
            'townsfolk';
        setupModifications.push({
            kind: 'ASSIGN_MASKED_ROLE',
            maskedSeat: 'self',
            shownRoleKey,
            trueRoleKey: record.roleKey,
            reason: 'Masking phrases detected',
            evidence: maskMatches
        });
    }
    if (!maskDetected && startKnowingMatches.length) {
        setupModifications.push({
            kind: 'START_KNOWING',
            recipients: 'self',
            payload: { detail: 'Start knowledge inferred from description' },
            reason: 'Start knowledge phrases detected',
            evidence: startKnowingMatches
        });
    }
    if (roleChangeMatches.length) {
        setupModifications.push({
            kind: 'SETUP_CONSTRAINT',
            constraintKey: 'ROLE_CHANGED',
            payload: { description: 'Role or alignment swap is established during setup' },
            reason: 'Role swap phrases detected',
            evidence: roleChangeMatches
        });
    }
    for (const change of roleCountChanges) {
        setupModifications.push({
            kind: 'ADD_ROLE_COUNT',
            target: change.target,
            delta: change.delta,
            reason: change.reason,
            evidence: [change.evidence]
        });
    }

    const nightEvidence =
        nightMatches.length > 0
            ? nightMatches
            : record.signals?.eachNight
                ? ['each night (signal)']
                : [];

    const nightOrderSteps: NightOrderStepSpec[] = [];
    if (isNightAction) {
        const when: NightOrderWhen =
            combinedText.includes('except the first') ? 'otherNights'
            : combinedText.includes('first night') ? 'firstNight'
            : 'everyNight';
        nightOrderSteps.push({
            when,
            blocksNight: Boolean(hasActive),
            description: 'Wakes to use ability at night.',
            evidence: nightEvidence
        });
    }

    const forcedNightWhen = NIGHT_ACTION_ROLES.has(record.roleKey)
        ? FIRST_NIGHT_ONLY_ROLES.has(record.roleKey)
            ? 'firstNight'
            : EVERY_NIGHT_EXCEPT_FIRST_ROLES.has(record.roleKey)
                ? 'otherNights'
                : EVERY_NIGHT_ROLES.has(record.roleKey)
                    ? 'everyNight'
                    : 'everyNight'
        : undefined;
    if (forcedNightWhen && !nightOrderSteps.some((step) => step.when === forcedNightWhen)) {
        nightOrderSteps.push({
            when: forcedNightWhen,
            blocksNight: true,
            description: 'Role flagged as acting at night via Trouble Brewing facts.',
            evidence: [`${record.roleKey} listed as night action (fact list)`]
        });
    }

    const tags: RoleTagSpec = {
        isInfoRole: Boolean(record.signals?.youLearn || combinedText.includes('learn')),
        isSetupModifier: setupModifications.length > 0,
        actsAtNight: isNightAction,
        actsByClaim: actsDuringDay,
        hasRoleSwap: roleChangeMatches.length > 0,
        hasAlignmentSwap: roleChangeMatches.length > 0,
        hasRegistrationWeirdness: registerMatches.length > 0,
        isGlobalRule: globalRuleMatches.length > 0
    };

    const stKinds = new Set<string>();
    if (tags.isInfoRole) {
        stKinds.add(infoKind(record.roleKey));
    }
    if (activeAbilities.length) {
        stKinds.add(resolveKind(record.roleKey, 'action'));
    }
    if (tags.isGlobalRule) {
        stKinds.add(rulesKind(`${record.roleKey}_global_rule`));
        stKinds.add(winCheckKind(record.roleKey));
    }
    if (onMoments.length) {
        onMoments.forEach(({ moment }, index) => {
            const safeMoment = typeof moment === 'string' && moment.length ? moment : `moment_${index}`;
            const normalizedMoment = safeMoment.replace(/[^A-Za-z0-9_]/g, '_');
            stKinds.add(triggerKind(record.roleKey, normalizedMoment));
        });
    }

    const todos = new Set<string>();
    stDiscretionMatches.forEach((entry) => {
        todos.add(`Storyteller discretion noted near "${entry.replace(' (ngram)', '').replace(' (text)', '')}".`);
    });

    const factTags = new Set<string>();
    for (const [set, tag] of NIGHT_ROLE_GROUP_FACTS) {
        if (set.has(record.roleKey)) {
            factTags.add(tag);
        }
    }
    if (MISREGISTRATION_ROLES.has(record.roleKey)) {
        factTags.add('misregistration');
    }
    if (SETUP_MODIFIER_ROLES.has(record.roleKey)) {
        factTags.add('setup-modifier');
    }
    const roleSpec: RoleSpec = {
        roleKey: record.roleKey,
        title: record.title,
        category: determineCategory(record, page),
        editionTags: record.editionTags ?? [],
        abilityText,
        summary: record.summary,
        howToRun: record.howToRun,
        examples: record.examples,
        setupModifications,
        nightOrderSteps,
        onMoments,
        passiveAbilities,
        activeAbilities,
        jinxes: record.jinxes,
        tags,
        stKinds: Array.from(stKinds),
        todos: todos.size ? Array.from(todos) : undefined,
        factTags: factTags.size ? Array.from(factTags).sort() : undefined
    };

    return roleSpec;
}

function countUniqueTodos(roleSpecs: RoleSpec[]): Record<string, number> {
    const counter = new Map<string, number>();
    for (const spec of roleSpecs) {
        if (!spec.todos) {
            continue;
        }
        for (const todo of spec.todos) {
            counter.set(todo, (counter.get(todo) ?? 0) + 1);
        }
    }
    const sorted = Array.from(counter.entries()).sort((a, b) => b[1] - a[1]);
    return Object.fromEntries(sorted);
}

async function writeResults(dir: string, specs: RoleSpec[], report: CompilerReport): Promise<void> {
    await fs.mkdir(dir, { recursive: true });
    const catalogPath = path.join(dir, 'roleSpecs.json');
    await fs.writeFile(catalogPath, JSON.stringify(specs, null, 2), 'utf8');

    const perRoleDir = path.join(dir, 'roleSpecs');
    await fs.mkdir(perRoleDir, { recursive: true });
    for (const spec of specs) {
        const dest = path.join(perRoleDir, `${spec.roleKey}.json`);
        await fs.writeFile(dest, JSON.stringify(spec, null, 2), 'utf8');
    }

    const reportPath = path.join(dir, 'compilerReport.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
}

async function loadConfig(filePath?: string): Promise<CompilerConfig> {
    if (!filePath) {
        try {
            await fs.access(DEFAULT_CONFIG_PATH);
            filePath = DEFAULT_CONFIG_PATH;
        } catch {
            return {};
        }
    }
    if (!filePath) {
        return {};
    }
    try {
        return await loadJsonFile<CompilerConfig>(filePath);
    } catch {
        console.warn(`[roleSpecCompiler] Failed to load config from ${filePath}`);
        return {};
    }
}

async function main(): Promise<void> {
    const options = parseCliArgs(process.argv.slice(2));
    const [records, pages, ngramIndex, config] = await Promise.all([
        loadRecords(options.recordsPath),
        loadPages(options.pagesDir),
        loadNgrams(options.ngramDir),
        loadConfig(options.configPath)
    ]);

    const thresholds = {
        nightAction: config.phraseThresholds?.nightAction ?? DEFAULT_PHRASE_THRESHOLDS.nightAction,
        dayClaim: config.phraseThresholds?.dayClaim ?? DEFAULT_PHRASE_THRESHOLDS.dayClaim
    };

    const forcedOverrides = config.forcedOverrides ?? {};

    const specs: RoleSpec[] = records.map((record) => {
        const page = pages.get(record.roleKey);
        const built = buildRoleSpec(record, page, ngramIndex, thresholds);
        const override = forcedOverrides[record.roleKey];
        if (override) {
            return mergeSpec(built, override);
        }
        return built;
    });

    specs.sort((a, b) => a.roleKey.localeCompare(b.roleKey));

    const report: CompilerReport = {
        rolesProcessed: specs.length,
        rolesWithActiveAbilities: specs.filter((spec) => spec.activeAbilities.length > 0).length,
        rolesWithTodos: specs.filter((spec) => Boolean(spec.todos?.length)).length,
        commonTodos: countUniqueTodos(specs)
    };

    await writeResults(options.outputDir, specs, report);
}

function mergeSpec(base: RoleSpec, override: Partial<RoleSpec>): RoleSpec {
    return {
        ...base,
        ...override,
        setupModifications: override.setupModifications ?? base.setupModifications,
        nightOrderSteps: override.nightOrderSteps ?? base.nightOrderSteps,
        onMoments: override.onMoments ?? base.onMoments,
        passiveAbilities: override.passiveAbilities ?? base.passiveAbilities,
        activeAbilities: override.activeAbilities ?? base.activeAbilities,
        jinxes: override.jinxes ?? base.jinxes,
        tags: override.tags !== undefined ? { ...base.tags, ...override.tags } : base.tags,
        stKinds: override.stKinds ?? base.stKinds,
        todos: override.todos ?? base.todos
    };
}

main().catch((error) => {
    console.error('[roleSpecCompiler] Failed to compile role specs:', error);
    process.exit(1);
});
