import fs from 'graceful-fs';
import { arch } from 'os';
import path from 'path';

export enum ArchTypePart1 {
    lower = 0,
    middle = 1,
    upper = 2
}
export enum ArchTypePart2 {
    wanderer = 0,
    worker = 1,
    clergy = 2,
    nobility = 3
}
export interface AvatarDescriptor {
    gender: Gender;
    ageGroup: AgeGroup;
    archetype: SocialArchetypeIndex;
    geography: GeographicOrigin;
    group1: ArchTypePart1;
    group2: ArchTypePart2;
    filename?: string;
    prompt?: string;
}
export enum Gender {
    'traditional male' = 0,
    'traditional female' = 1,
    'non binary' = 2,
    'male to female' = 3,
    'female to male' = 4
}

export enum AgeGroup {
    'late teen' = 0,
    'college-aged' = 1,
    'single young adult' = 2,
    'newlywed' = 3,
    'married w/ children' = 4,
    'empty nester' = 5,
    'senior' = 6
}
export type SocialArchetypeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export enum SocialArchetype {
    'vagrant/beggar' = 0,
    'nomad' = 1,
    'peddler/mercenary' = 2,
    'laborer/serf' = 3,
    'artisan/apprentice' = 4,
    'merchant/guildmaster' = 5,
    'local priest' = 6,
    'monk/deacon' = 7,
    'bishop/priest' = 8,
    'page/squire' = 9,
    'knight/baron' = 10,
    'high nobility' = 11
}

export enum GeographicOrigin {
    'Germanic / French' = 0,
    'Viking / Dane' = 1,
    'Jewish' = 2,
    'Middle Eastern / Persian' = 3,
    'North African' = 4,
    'Black South African' = 5,
    'Japanese East Asian' = 6,
    'Southeast Asian' = 7,
    'Latino / South American' = 8,
    'American Indian' = 9,
    'Chinese / Mainland East Asian' = 10,
    'Aboriginal Australian' = 11,
    'Anglo-Austrailian / Kiwi' = 12,
    'Indian (Subcontinent Urban)' = 13,
    'Hawaiian / Polynesian' = 14,
    'East Slavic (Rus / Ukrainian / Russian)' = 15,
    'Greek / Hellenic' = 16,
    'Celtic / Druidic (British Isles)' = 17,
    'Caribbean (Haitian / Jamaican / Dominican)' = 18
}

export const SocialArchType = {
    [ArchTypePart2.wanderer]: [['vagrant/beggar', 'nomad', 'peddler/entertainer']],
    [ArchTypePart2.worker]: ['laborer/serf', 'artisan/apprentice', 'merchant/guildmaster'],
    [ArchTypePart2.clergy]: ['local priest', 'monk/deacon', 'bishop/priest'],
    [ArchTypePart2.nobility]: ['page/squire', 'knight/baron', 'monarch/high nobility']
};

export const AVATAR_PROMPT_TEMPLATE = ({
    gender,
    group1,
    group2,
    archetype,
    ageGroup,
    geography
}: AvatarDescriptor) => {
    return `FILENAME *****  ${[geography.toFixed(0), ageGroup.toFixed(0), gender.toFixed(0), group1.toFixed(0), group2.toFixed(0)].join('_').concat('.png')} *****    Portrait-style character illustration, waist-up. Gender presentation: ${Gender[gender]} Age group: ${AgeGroup[ageGroup]} Social Groups: ${ArchTypePart1[group1]} ${ArchTypePart2[group2]} Social archetype: ${SocialArchetype[archetype]} Geographic origin: ${GeographicOrigin[geography]} Portrait-style character illustration, waist-up (waist-up, chest-up or shoulders-up is acceptable), designed as a square 1:1 game-token icon (125x125 px), centered, high-contrast, readable at very small sizes, with a transparent background. Digitally illustrated fantasy art optimized for game UI, featuring cinematic lighting, idealized realism, and high symbolic clarity with a medieval-fantasy-adjacent tone.Subject is a ${AgeGroup[ageGroup]} ${ArchTypePart1[group1]}-class ${ArchTypePart2[group2]} of ${SocialArchType[group2][group1]} background, with gender presentation leaning ${Gender[gender]}. Facial features, hair texture, and styling should reflect a ${GeographicOrigin[geography]} geographic origin respectfully and accurately. Age should be visible in youthful facial structure, slightly uncertain posture, lightly worn clothing, and a restrained, neutral-to-subtle expression suitable for a social deduction game.Clothing should be simple, practical, and historically grounded: rough natural materials, modest cuts, minimal ornamentation, visibly worn but functional, with no modern elements. No exaggerated features or caricature.Background should be minimal and atmospheric, subtly evoking the subject's geographic region without distracting detail.No text. No watermark.`.trim();
};

// export function generateAvatarPrompt(avatar: AvatarDescriptor): string {
//     return AVATAR_PROMPT_TEMPLATE.replace('{{gender}}', avatar.gender)
//         .replace('{{ageGroup}}', avatar.ageGroup)
//         .replace('{{archetype}}', avatar.archetype)
//         .replace('{{geography}}', avatar.geography);
// }

// function pick<T>(rng: seedrandom.PRNG, values: readonly T[]): T {
//     return values[Math.floor(rng() * values.length)];
// }

/**
 * Shuffles array in place using the Fisher-Yates shuffle algorithm.
 * @param {Array} array The array containing the items to shuffle.
 * @returns {Array} The shuffled array (modifies the original array).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shuffleArray(array: any[]) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element using array destructuring.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

const calculateArchetype = ({ group1, group2 }: { group1: number; group2: number }): SocialArchetypeIndex =>
    ((group2 + 1) * 3 + (group1 + 1)) as SocialArchetypeIndex;
export function generateAvatarFromSeed(): AvatarDescriptor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const group1 = shuffleArray([0, 1, 2])[0];
    const group2 = shuffleArray([0, 1, 2, 3])[0];
    const geography = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])[0];
    const archetype = calculateArchetype({ group1, group2 });
    const ageGroup = shuffleArray([0, 1, 2, 3, 4, 5, 6])[0];
    const gender = shuffleArray([0, 1, 2, 3, 4])[0];
    return {
        gender,
        ageGroup,
        geography,
        group1,
        group2,
        archetype,
        filename: [geography.toFixed(0), ageGroup.toFixed(0), gender.toFixed(0), group1.toFixed(0), group2.toFixed(0)]
            .join('_')
            .concat('.png')
    };
}

const generateAvatar = ({
    ageGroup,
    gender,
    geography,
    group1,
    group2,
    filename
}: Pick<AvatarDescriptor, 'gender' | 'group1' | 'group2' | 'geography' | 'ageGroup' | 'archetype' | 'filename'> & {
    filename?: string;
}) =>
    ({
        geography,
        ageGroup,
        group1,
        group2,
        gender,
        archetype: calculateArchetype({ group1, group2 }),
        filename:
            filename ??
            [geography, ageGroup, gender, group1, group2]
                .map((x) => x.toFixed(0))
                .join('_')
                .concat('.png'),
        prompt: AVATAR_PROMPT_TEMPLATE({
            gender,
            group1,
            group2,
            archetype: calculateArchetype({ group1, group2 }),
            ageGroup,
            geography
        })
    }) as AvatarDescriptor;

const parseFilename = (fn: string) => {
    const [geography, ageGroup, gender, group1, group2] = fn
        .split('.')[0]
        .split('_')
        .map((x) => parseInt(x, 10));
    const archetype = calculateArchetype({ group1, group2 });
    return generateAvatar({ geography, gender, group1, group2, ageGroup, archetype });
};

// const avatar = generateAvatarFromSeed('ai_shadow_warden_042');
// const prompt = generateAvatarPrompt(avatar);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const element = [] as any[];
for (let index = 0; index < 25; index++) {
    element.push(AVATAR_PROMPT_TEMPLATE(generateAvatarFromSeed()));
}

// console.log(element.concat('\n').join('\n'));

const dir = `/home/bobby/Downloads/avatars`;

const files = fs.readdirSync(dir);

const filenames = files.map((x) => path.basename(x, path.extname(x))).map(parseFilename);
// src/crossProductGenerator.ts

type FiveTuple = [number, number, number, number, number];

/**
 * Generates the Cartesian product of five specific ranges:
 * [0-7], [0-4], [0-3], [0-2], [0-6]
 */
export function* getNumberTuples(): Generator<FiveTuple> {
    for (let i = 10; i <= 18; i++) {
        for (let j = 0; j <= 6; j++) {
            for (let k = 0; k <= 4; k++) {
                for (let l = 0; l <= 2; l++) {
                    for (let m = 0; m <= 3; m++) {
                        yield [i, j, k, l, m];
                    }
                }
            }
        }
    }
}

// Example usage:

const comparator = (
    a: Pick<AvatarDescriptor, 'gender' | 'group1' | 'group2' | 'geography' | 'ageGroup' | 'archetype' | 'filename'>,
    b: Pick<AvatarDescriptor, 'gender' | 'group1' | 'group2' | 'geography' | 'ageGroup' | 'archetype' | 'filename'>
) => a.filename === b.filename;

// console.log(filenames);
const tuples = Array.from(getNumberTuples()).filter((x) => {
    const fn2 = x
        .map((x) => x.toFixed(0))
        .join('_')
        .concat('.png');
    console.log(`filenames`, filenames);
    return !filenames.some((fn) => fn.filename === fn2);
});

const currentList = JSON.parse(
    fs.readFileSync(`./chats/outstanding-avatars-keyart.json`, 'utf-8')
) as AvatarDescriptor[];

const totalList = [
    ...currentList.map((x) => [x.geography, x.ageGroup, x.gender, x.group1, x.group2] as FiveTuple),
    ...tuples
];
console.log(totalList.length);
// console.log(tuples);
// fs.writeFileSync(
//     `./chats/outstanding-avatars-prereview.json`,
//     JSON.stringify(
//         shuffleArray(totalList).map((x) => {
//             return generateAvatar({
//                 geography: x[0],
//                 ageGroup: x[1],
//                 gender: x[2],
//                 group1: x[3],
//                 group2: x[4],
//                 archetype: 0
//             });
//         }),
//         null,
//         '\t'
//     )
// );

// console.log(filenames);

const data = JSON.parse(fs.readFileSync('./chats/outstanding-avatars-standardized.json').toString());

function replacer()