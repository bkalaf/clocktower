//scripts/parse-botc-wiki-dump.mjs
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const INPUT_DIR = path.resolve('./botc_wiki_dump');
const OUT_DIR = path.resolve('./botc_wiki_parsed');
const OUT_PAGES = path.join(OUT_DIR, 'normalizedPages');

fs.mkdirSync(OUT_PAGES, { recursive: true });

const HEADING_MAP = [
    // normalize many possible headings → canonical keys
    { re: /^summary$/i, key: 'summary' },
    { re: /^how to run$/i, key: 'how_to_run' },
    { re: /^examples?$/i, key: 'examples' },
    { re: /^jinx(es)?$/i, key: 'jinxes' },
    { re: /^rulings?$/i, key: 'rulings' },
    { re: /^how to play$/i, key: 'how_to_run' }
];

function canonicalHeading(h) {
    const cleaned = h.replace(/\s+/g, ' ').trim();
    for (const m of HEADING_MAP) if (m.re.test(cleaned)) return m.key;
    return cleaned; // keep unknown headings in "other"
}

function splitSections(wikitext: string) {
  const sections: Record<string, string> = {};
  const regex = /^==\s*(.+?)\s*==\s*$/gm;

  let lastIndex = 0;
  let lastHeader: string | null = null;
  let match;

  while ((match = regex.exec(wikitext)) !== null) {
    if (lastHeader) {
      sections[lastHeader] = wikitext
        .slice(lastIndex, match.index)
        .trim();
    }
    lastHeader = match[1].trim();
    lastIndex = regex.lastIndex;
  }

  if (lastHeader) {
    sections[lastHeader] = wikitext.slice(lastIndex).trim();
  }

  return sections;
}
function normalizeHeading(h: string) {
  const key = h.toLowerCase().trim();
  if (key === "summary") return "summary";
  if (key === "how to run") return "how_to_run";
  if (key === "examples") return "examples";
  if (key === "tips & tricks") return "tips";
  if (key.startsWith("bluffing")) return "bluffing";
  return "other";
}


function htmlToSections(html) {
    const $ = cheerio.load(html);
    const content = $('#mw-content-text');
    if (!content.length) return { sections: {}, other: {} };

    // MediaWiki headings are usually h2/h3
    const nodes = content.find('h2, h3, p, ul, ol, table, blockquote').toArray();

    let currentKey = 'summary'; // default bucket if no heading encountered
    const sections = {};
    const other = {};

    function append(key, text) {
        if (!text) return;
        if (!sections[key]) sections[key] = [];
        sections[key].push(text);
    }

    for (const node of nodes) {
        const tag = node.tagName?.toLowerCase();
        if (tag === 'h2' || tag === 'h3') {
            const headingText = $(node).find('.mw-headline').text().trim() || $(node).text().trim();
            const key = canonicalHeading(headingText || 'other');
            currentKey = key;
            continue;
        }

        // gather readable text
        let text = $(node).text().replace(/\s+/g, ' ').trim();
        if (!text) continue;

        // avoid nav junk
        if (/^\s*(jump to navigation|jump to search)\s*$/i.test(text)) continue;

        append(currentKey, text);
    }

    // join arrays into strings
    const out = {};
    for (const [k, arr] of Object.entries(sections)) out[k] = arr.join('\n');

    // anything not in our canonical keys goes to other
    const canonicalKeys = new Set(HEADING_MAP.map((x) => x.key));
    for (const [k, v] of Object.entries(out)) {
        if (!canonicalKeys.has(k) && k !== 'summary') {
            other[k] = v;
            delete out[k];
        }
    }

    return { sections: out, other };
}

function slugifyRoleKey(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[’']/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, obj) {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function inferCategoryHint(dump) {
    // uses whatever your dumper stored (categoryHint), else unknown
    return dump.categoryHint || dump.category || 'unknown';
}

function normalizeDumpRecord(dump) {
    const roleKey = dump.roleKey || slugifyRoleKey(dump.title);
    const { sections, other } = htmlToSections(dump.html || '');

    // fallback: if summary missing, use first ~2 lines of wikitext
    if (!sections.summary && dump.wikitext) {
        sections.summary = dump.wikitext
            .split('\n')
            .slice(0, 8)
            .join('\n')
            .replace(/\{\{.*?\}\}/g, '')
            .replace(/\[\[|\]\]/g, '')
            .trim();
    }

    return {
        title: dump.title,
        roleKey,
        url: dump.source?.url || dump.url || '',
        categoryHint: inferCategoryHint(dump),
        sections,
        other,
        source: dump.source || { fetchedAt: null, pageid: dump.pageid ?? null }
    };
}

function buildRoleRecord(page) {
    // minimal “truth layer” for now; you’ll refine later
    const text = page.sections.summary || page.sections.how_to_run || page.sections.examples || '';

    const abilityText = page.sections.summary || '';

    // signals (heuristics)
    const signals = {
        eachNight: /\beach night\b/i.test(text),
        eachDay: /\beach day\b/i.test(text),
        oncePerGame: /\bonce per game\b/i.test(text),
        youLearn: /\byou (learn|know|are told)\b/i.test(text),
        choose: /\bchoose\b/i.test(text),
        might: /\bmight\b/i.test(text)
    };

    return {
        roleKey: page.roleKey,
        title: page.title,
        url: page.url,
        categoryHint: page.categoryHint,
        abilityText,
        howToRun: page.sections.how_to_run || '',
        examples: page.sections.examples ? page.sections.examples.split('\n') : [],
        jinxes: page.sections.jinxes ? page.sections.jinxes.split('\n') : [],
        signals
    };
}

function main() {
    const files = fs
        .readdirSync(INPUT_DIR)
        .filter((f) => f.endsWith('.json'))
        .map((f) => path.join(INPUT_DIR, f));

    const normalizedPages = [];
    for (const f of files) {
        const dump = readJson(f);
        const normalized = normalizeDumpRecord(dump);
        normalizedPages.push(normalized);

        const outFile = path.join(OUT_PAGES, `${normalized.roleKey}.json`);
        writeJson(outFile, normalized);
    }

    // build aggregated roleRecords.json
    const roleRecords = normalizedPages.map(buildRoleRecord);
    writeJson(path.join(OUT_DIR, 'roleRecords.json'), roleRecords);

    console.log(`Parsed ${normalizedPages.length} pages`);
    console.log(`Wrote: ${OUT_PAGES}`);
    console.log(`Wrote: ${path.join(OUT_DIR, 'roleRecords.json')}`);
}

main();
