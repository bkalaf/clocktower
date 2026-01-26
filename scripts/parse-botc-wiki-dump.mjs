// parse-botc-wiki-dump.mjs
// Usage examples:
//   node parse-botc-wiki-dump.mjs --in ./botc_wiki_dump --out ./botc_wiki_parsed
//   node parse-botc-wiki-dump.mjs --in ./dump --out ./parsed --pages
//
// Outputs:
//   <out>/roleRecords.json
//   <out>/jinxIndex.json
//   (optional) <out>/normalizedPages/<roleKey>.json

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
    const args = { inDir: '', outDir: '', writePages: false };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--in') args.inDir = argv[++i] ?? '';
        else if (a === '--out') args.outDir = argv[++i] ?? '';
        else if (a === '--pages') args.writePages = true;
    }
    if (!args.inDir || !args.outDir) {
        console.error('Usage: node parse-botc-wiki-dump.mjs --in <inputDir> --out <outputDir> [--pages]');
        process.exit(1);
    }
    return args;
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, obj) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function slugifyRoleKey(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

// --- WIKITEXT PARSING ---

function cutToSummary(wikitext) {
    if (!wikitext) return '';
    let idx = wikitext.indexOf('== Summary ==');
    if (idx >= 0) return wikitext.slice(idx);

    // fallback: tolerate spacing differences
    const m = wikitext.match(/^==\s*Summary\s*==\s*$/m);
    if (!m) return '';
    idx = wikitext.indexOf(m[0]);
    return idx >= 0 ? wikitext.slice(idx) : '';
}

function splitSections(wikitextFromSummary) {
    // Returns: { [heading: string]: body }
    const sections = {};
    if (!wikitextFromSummary) return sections;

    const re = /^==\s*(.+?)\s*==\s*$/gm;
    const matches = [];
    let m;
    while ((m = re.exec(wikitextFromSummary)) !== null) {
        matches.push({ name: m[1].trim(), start: m.index, end: re.lastIndex });
    }
    for (let i = 0; i < matches.length; i++) {
        const cur = matches[i];
        const next = matches[i + 1];
        const bodyStart = cur.end;
        const bodyEnd = next ? next.start : wikitextFromSummary.length;
        sections[cur.name] = wikitextFromSummary.slice(bodyStart, bodyEnd).trim();
    }
    return sections;
}

function parseCategories(wikitext) {
    const out = [];
    const re = /\[\[Category:([^\]]+)\]\]/g;
    let m;
    while ((m = re.exec(wikitext)) !== null) out.push(m[1].trim());
    return out;
}

function parseJinxTemplates(wikitext) {
    // {{Jinx|RoleName|roleKey|Good|Text...}}
    const out = [];
    const re = /\{\{Jinx\|([^|]+)\|([^|]+)\|([^|]+)\|([^}]+)\}\}/g;
    let m;
    while ((m = re.exec(wikitext)) !== null) {
        out.push({
            with: m[1].trim(),
            withKey: m[2].trim(),
            alignment: m[3].trim(),
            text: m[4].trim()
        });
    }
    return out;
}

function cleanWikitext(text) {
    if (!text) return '';
    let t = text;

    // Remove file embeds
    t = t.replace(/\[\[File:[^\]]+\]\]/gi, '');

    // Templates {{Good|X}} / {{Evil|X}} => X
    t = t.replace(/\{\{\s*(Good|Evil)\s*\|\s*([^}]+?)\s*\}\}/g, '$2');

    // Wiki links [[A|B]] -> B; [[A]] -> A
    t = t.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
    t = t.replace(/\[\[([^\]]+)\]\]/g, '$1');

    // Bold/italic markup
    t = t.replaceAll("'''", '').replaceAll("''", '');

    // Convert bullets
    t = t.replace(/^\*\*\s*/gm, '  - ');
    t = t.replace(/^\*\s*/gm, '- ');

    // Strip remaining templates conservatively
    t = t.replace(/\{\{[^}]+\}\}/g, '');

    // Strip HTML tags
    t = t.replace(/<[^>]+>/g, '');

    // Normalize whitespace
    t = t.replace(/[ \t]+\n/g, '\n');
    t = t.replace(/\n{3,}/g, '\n\n');

    return t.trim();
}

function splitExamples(examplesWikitext) {
    if (!examplesWikitext) return [];
    // Many pages wrap examples in <div class='example'> ... </div>
    if (examplesWikitext.includes("div class='example'")) {
        const parts = examplesWikitext.split("<div class='example'>");
        const cleaned = parts.map((p) => cleanWikitext(p)).filter((p) => p && p.length > 0);
        return cleaned;
    }

    // Fallback: split by double newlines
    const cleaned = cleanWikitext(examplesWikitext);
    return cleaned
        .split('\n\n')
        .map((s) => s.trim())
        .filter(Boolean);
}

// --- NORMALIZATION + ROLE RECORDS ---

function inferEditionTags(categories) {
    const tags = [];
    const known = new Set(['Trouble Brewing', 'Sects & Violets', 'Bad Moon Rising', 'Experimental Characters']);
    for (const c of categories) if (known.has(c)) tags.push(c);
    return tags;
}

function normalizeDump(dump) {
    const title = dump.title ?? '';
    const roleKey = dump.roleKey ?? slugifyRoleKey(title);
    const url = dump?.source?.url ?? dump.url ?? '';
    const categoryHint = dump.categoryHint ?? 'unknown';

    const wikitext = dump.wikitext ?? '';
    const categories = parseCategories(wikitext);
    const editionTags = inferEditionTags(categories);

    const fromSummary = cutToSummary(wikitext);
    const rawSections = splitSections(fromSummary);

    const summary = cleanWikitext(rawSections['Summary'] ?? '');
    const howToRun = cleanWikitext(rawSections['How to Run'] ?? '');
    const examples = splitExamples(rawSections['Examples'] ?? '');

    const jinxes = parseJinxTemplates(wikitext);

    // Keep everything else for later (optional)
    const otherSections = {};
    for (const [k, v] of Object.entries(rawSections)) {
        if (k === 'Summary' || k === 'How to Run' || k === 'Examples') continue;
        const cleaned = cleanWikitext(v);
        if (cleaned) otherSections[k] = cleaned;
    }

    return {
        roleKey,
        title,
        url,
        categoryHint,
        categories,
        editionTags,
        sections: {
            summary,
            how_to_run: howToRun,
            examples,
            other: otherSections
        },
        jinxes
    };
}

function computeSignals(role) {
    const text = [role.sections.summary, role.sections.how_to_run].filter(Boolean).join('\n');
    return {
        eachNight: /\beach night\b/i.test(text),
        eachDay: /\beach day\b/i.test(text),
        oncePerGame: /\bonce per game\b/i.test(text),
        youLearn: /\byou (learn|know|are told)\b/i.test(text),
        choose: /\bchoose\b/i.test(text),
        dies: /\bdie(s)?\b/i.test(text)
    };
}

function buildRoleRecord(normalized) {
    return {
        roleKey: normalized.roleKey,
        title: normalized.title,
        url: normalized.url,
        category: normalized.categoryHint,
        editionTags: normalized.editionTags,
        abilityText: normalized.sections.summary,
        howToRun: normalized.sections.how_to_run,
        examples: normalized.sections.examples,
        jinxes: normalized.jinxes,
        signals: computeSignals(normalized)
    };
}

function buildJinxIndex(roleRecords) {
    // Pairwise map: "a|b" -> info
    const index = {};
    for (const rr of roleRecords) {
        for (const j of rr.jinxes ?? []) {
            const a = rr.roleKey;
            const b = j.withKey;
            const key = [a, b].sort().join('|');
            index[key] = {
                roles: [a, b].sort(),
                roleTitles: [rr.title, j.with],
                alignmentTag: j.alignment,
                text: j.text,
                sourceRole: rr.roleKey
            };
        }
    }
    return index;
}

// --- MAIN ---

function main() {
    const args = parseArgs(process.argv);
    const inDir = path.resolve(args.inDir);
    const outDir = path.resolve(args.outDir);

    const files = fs.readdirSync(inDir).filter((f) => f.endsWith('.json'));
    if (files.length === 0) {
        console.error('No .json files found in input dir:', inDir);
        process.exit(1);
    }

    const normalizedPages = [];
    for (const f of files) {
        const full = path.join(inDir, f);
        const dump = readJson(full);
        const norm = normalizeDump(dump);
        normalizedPages.push(norm);

        if (args.writePages) {
            writeJson(path.join(outDir, 'normalizedPages', `${norm.roleKey}.json`), norm);
        }
    }

    const roleRecords = normalizedPages.map(buildRoleRecord);
    const jinxIndex = buildJinxIndex(roleRecords);

    writeJson(path.join(outDir, 'roleRecords.json'), roleRecords);
    writeJson(path.join(outDir, 'jinxIndex.json'), jinxIndex);

    console.log(`Parsed dumps: ${normalizedPages.length}`);
    console.log(`Wrote: ${path.join(outDir, 'roleRecords.json')}`);
    console.log(`Wrote: ${path.join(outDir, 'jinxIndex.json')}`);
    if (args.writePages) console.log(`Wrote per-page normalized JSON: ${path.join(outDir, 'normalizedPages')}`);
}

main();
