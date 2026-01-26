import fs from 'fs/promises';
import path from 'path';
import { NormalizedWikiPage, RoleRecord, JinxEntry, JinxIndexEntry } from '../src/spec/wikiTypes';

const SECTION_HEADING_REGEX = /^==\s*(.+?)\s*==\s*$/gm;
const JINX_REGEX = /\{\{Jinx\|([^|}]+)\|([^|}]+)\|([^|}]+)\|([\s\S]+?)\}\}/gi;
const SUMMARY_HEADING_REGEX = /==\s*Summary\s*==/i;
const EDITION_TAG_CANDIDATES = [
    'Trouble Brewing',
    'Sects & Violets',
    'Bad Moon Rising',
    'Experimental Characters'
];
const EXAMPLE_DIV_REGEX = /<div\s+class=['"]example['"][^>]*>([\s\S]*?)<\/div>/gi;
const STOPSET = new Set(['Summary', 'How to Run', 'Examples']);

function slugify(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/[’'"`]/g, '')
        .replace(/[^a-z0-9]+/gi, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
}

function extractSections(text: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const regex = new RegExp(SECTION_HEADING_REGEX.source, SECTION_HEADING_REGEX.flags);
    let match: RegExpExecArray | null;
    let lastHeading: string | null = null;
    let lastIndex = 0;

    while ((match = regex.exec(text))) {
        if (lastHeading) {
            sections[lastHeading] = text.slice(lastIndex, match.index).trim();
        }
        lastHeading = match[1].trim();
        lastIndex = match.index + match[0].length;
    }

    if (lastHeading) {
        sections[lastHeading] = text.slice(lastIndex).trim();
    }

    return sections;
}

function stripSurroundingQuotes(line: string): string {
    const trimmed = line.trim();
    return trimmed.replace(/^["“”]+/, '').replace(/["“”]+$/, '').trim();
}

function findAbilityLine(summaryBody: string): { abilityLine: string; summaryRest: string } {
    const lines = summaryBody.split(/\r?\n/);
    let firstLineIndex = -1;
    for (let i = 0; i < lines.length; i += 1) {
        const trimmed = lines[i].trim();
        if (!trimmed) continue;
        if (/^["“”']+$/.test(trimmed)) continue;
        firstLineIndex = i;
        break;
    }

    if (firstLineIndex === -1) {
        return { abilityLine: '', summaryRest: summaryBody.trim() };
    }

    const abilityLine = stripSurroundingQuotes(lines[firstLineIndex]);
    const summaryRest = lines.slice(firstLineIndex + 1).join('\n').trim();
    return { abilityLine, summaryRest };
}

function cleanText(input: string): string {
    if (!input) {
        return '';
    }

    let text = input.replace(/\r/g, '');
    text = text.replace(/\[\[File:[^\]]+\]\]/gi, '');
    text = text.replace(/\[\[Category:[^\]]+\]\]/gi, '');
    text = text.replace(/\{\{(?:Good|Evil)\|([^\}]+)\}\}/gi, '$1');
    text = text.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
        const pieces = inner.split('|');
        return pieces[pieces.length - 1];
    });
    text = text.replace(/'{2,3}/g, '');
    text = text.replace(/^\s*\*\*/gm, '  - ');
    text = text.replace(/^\s*\*/gm, '- ');
    text = text.replace(/\{\{[\s\S]+?\}\}/g, '');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/\n{3,}/g, '\n\n');

    return text.trim();
}

function extractExamplesFromText(raw: string): string[] {
    if (!raw.trim()) {
        return [];
    }

    const matches: string[] = [];
    let match: RegExpExecArray | null;
    const divRegex = new RegExp(EXAMPLE_DIV_REGEX.source, EXAMPLE_DIV_REGEX.flags);

    while ((match = divRegex.exec(raw))) {
        matches.push(match[1].trim());
    }

    if (matches.length) {
        return matches.map((fragment) => cleanText(fragment)).filter(Boolean);
    }

    const cleaned = cleanText(raw);
    if (!cleaned) {
        return [];
    }

    return cleaned
        .split(/\n\s*\n/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
}

function parseCategories(text: string): string[] {
    const matches = text.matchAll(/\[\[Category:([^\]|]+)(?:\|[^\]]+)?\]\]/gi);
    const categories = new Set<string>();
    for (const match of matches) {
        const category = match[1].trim();
        if (category) {
            categories.add(category);
        }
    }
    return Array.from(categories).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

function parseJinxes(text: string): JinxEntry[] {
    const entries: JinxEntry[] = [];
    let match: RegExpExecArray | null;
    JINX_REGEX.lastIndex = 0;

    while ((match = JINX_REGEX.exec(text))) {
        const withName = match[1].trim();
        const withKey = match[2].trim();
        const alignment = match[3].trim();
        const rawText = match[4].trim();
        entries.push({
            with: withName,
            withKey: withKey || slugify(withName),
            alignment,
            text: cleanText(rawText)
        });
    }

    return entries;
}

function computeSignals(...sourceTexts: (string | undefined)[]): NormalizedWikiPage['signals'] {
    const combined = sourceTexts.filter(Boolean).join(' ').replace(/\*/g, '').toLowerCase();
    return {
        eachNight: /\beach night\b/.test(combined),
        eachDay: /\beach day\b/.test(combined),
        oncePerGame: /\b(?:once|one) per game\b/.test(combined),
        youLearn: /\blearn(?:s|ed)?\b/.test(combined),
        choose: /\bchoose(?:s|ing)?\b/.test(combined),
        dies: /\bdie(?:s|d|ing)?\b/.test(combined)
    };
}

interface CliOptions {
    inputDir: string;
    outputDir: string;
}

function parseCliArgs(argv: string[]): CliOptions {
    const args = [...argv];
    const getVal = (flag: string) => {
        const index = args.indexOf(flag);
        if (index === -1 || index === args.length - 1) {
            return null;
        }
        const value = args[index + 1];
        args.splice(index, 2);
        return value;
    };

    const inputDir = getVal('--in');
    const outputDir = getVal('--out');

    if (!inputDir || !outputDir) {
        throw new Error('Usage: node ./dist/scripts/parseWikiDump.js --in <inputDir> --out <outputDir>');
    }

    return {
        inputDir: path.resolve(inputDir),
        outputDir: path.resolve(outputDir)
    };
}

async function writeJson(dest: string, data: unknown): Promise<void> {
    const formatted = JSON.stringify(data, null, 2) + '\n';
    await fs.writeFile(dest, formatted, 'utf-8');
}

async function main() {
    const { inputDir, outputDir } = parseCliArgs(process.argv.slice(2));
    const files = await fs.readdir(inputDir);
    const pagesDir = path.join(outputDir, 'pages');
    await fs.mkdir(pagesDir, { recursive: true });

    const normalizedPages: NormalizedWikiPage[] = [];
    const roleRecords: RoleRecord[] = [];
    const pageTitles = new Map<string, string>();
    let skipped = 0;

    for (const filename of files) {
        if (!filename.endsWith('.json')) {
            continue;
        }

        const filePath = path.join(inputDir, filename);
        const raw = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(raw);
        const wikitext = (data.wikitext as string | undefined) ?? '';
        if (!wikitext) {
            console.warn(`Skipping ${filename}: missing wikitext`);
            skipped += 1;
            continue;
        }

        const summaryMatch = SUMMARY_HEADING_REGEX.exec(wikitext);
        SUMMARY_HEADING_REGEX.lastIndex = 0;
        if (!summaryMatch) {
            console.warn(`Skipping ${filename}: no Summary section`);
            skipped += 1;
            continue;
        }

        const relevantText = wikitext.slice(summaryMatch.index);
        const sections = extractSections(relevantText);
        const summaryBody = sections['Summary'] ?? '';
        if (!summaryBody.trim()) {
            console.warn(`Skipping ${filename}: empty Summary body`);
            skipped += 1;
            continue;
        }

        const { abilityLine, summaryRest } = findAbilityLine(summaryBody);
        const cleanedAbility = cleanText(abilityLine);
        const cleanedSummary = cleanText(summaryRest);

        const howToRunSection = sections['How to Run'] ?? '';
        const cleanedHowToRun = cleanText(howToRunSection);

        const explicitExamples = sections['Examples'] ? extractExamplesFromText(sections['Examples']) : [];
        const examples =
            explicitExamples.length > 0 ? explicitExamples : extractExamplesFromText(summaryBody);

        const categories = parseCategories(wikitext);
        const editionTags = EDITION_TAG_CANDIDATES.filter((tag) => categories.includes(tag));

        const otherSections: Record<string, string> = {};
        Object.entries(sections).forEach(([heading, body]) => {
            const normalized = cleanText(body);
            if (STOPSET.has(heading)) {
                return;
            }
            otherSections[heading] = normalized;
        });

        const sortedOtherSections = Object.fromEntries(
            Object.entries(otherSections)
                .filter(([_, value]) => value)
                .sort(([a], [b]) => a.localeCompare(b))
        );

        const parsedJinxes = parseJinxes(wikitext);

        const roleKey = (data.roleKey as string | undefined) ?? slugify(data.title ?? filename.replace(/\.json$/i, ''));
        const title = String(data.title ?? data.roleKey ?? '' );
        const url = data.source?.url ?? `https://wiki.bloodontheclocktower.com/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
        const signals = computeSignals(cleanedAbility, cleanedSummary, cleanedHowToRun);

        const normalizedPage: NormalizedWikiPage = {
            roleKey,
            title,
            url,
            categoryHint: data.categoryHint,
            categories,
            editionTags,
            abilityText: cleanedAbility,
            summary: cleanedSummary,
            howToRun: cleanedHowToRun || undefined,
            examples,
            jinxes: parsedJinxes,
            otherSections: sortedOtherSections,
            signals,
            sections: {
                summary: cleanedSummary || undefined,
                how_to_run: cleanedHowToRun || undefined,
                examples,
                other: sortedOtherSections
            }
        };

        normalizedPages.push(normalizedPage);
        pageTitles.set(roleKey, title);

        const roleRecord: RoleRecord = {
            roleKey,
            title,
            url,
            categoryHint: data.categoryHint,
            editionTags,
            abilityText: cleanedAbility,
            summary: cleanedSummary,
            howToRun: cleanedHowToRun || undefined,
            examples,
            jinxes: parsedJinxes,
            signals
        };

        roleRecords.push(roleRecord);
        await writeJson(path.join(pagesDir, `${roleKey}.json`), normalizedPage);
    }

    const sortedRoles = normalizedPages.sort((a, b) => a.roleKey.localeCompare(b.roleKey));
    const sortedRoleRecords = roleRecords.sort((a, b) => a.roleKey.localeCompare(b.roleKey));

    const jinxIndex: Record<string, JinxIndexEntry> = {};
    for (const page of sortedRoles) {
        for (const jinx of page.jinxes) {
            const pair = [page.roleKey, jinx.withKey].sort();
            const key = `${pair[0]}|${pair[1]}`;
            if (jinxIndex[key]) {
                continue;
            }

            const resolveTitle = (roleKey: string): string => {
                if (roleKey === page.roleKey) {
                    return page.title;
                }
                return pageTitles.get(roleKey) ?? jinx.with;
            };

            const roleTitles: [string, string] = [resolveTitle(pair[0]), resolveTitle(pair[1])];
            jinxIndex[key] = {
                roles: [pair[0], pair[1]] as [string, string],
                roleTitles,
                alignmentTag: jinx.alignment,
                text: jinx.text,
                sourceRole: page.roleKey
            };
        }
    }

    await writeJson(path.join(outputDir, 'roleRecords.json'), sortedRoleRecords);
    const jinxIndexSorted = Object.fromEntries(Object.entries(jinxIndex).sort(([a], [b]) => a.localeCompare(b)));
    await writeJson(path.join(outputDir, 'jinxIndex.json'), jinxIndexSorted);

    console.log(`Processed ${sortedRoles.length} pages (${skipped} skipped).`);
    console.log(`Written ${sortedRoles.length} normalized pages to ${pagesDir}.`);
    console.log(`roleRecords.json contains ${sortedRoleRecords.length} entries.`);
    console.log(`jinxIndex.json contains ${Object.keys(jinxIndexSorted).length} entries.`);
}

if (import.meta.main) {
    main().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}

export {
    extractSections,
    findAbilityLine,
    parseCategories,
    parseJinxes,
    cleanText,
    slugify,
    extractExamplesFromText
};
