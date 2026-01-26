// dump-botc-wiki.mjs
// Node 18+
// Usage: node dump-botc-wiki.mjs
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('./botc_wiki_dump');
fs.mkdirSync(OUT_DIR, { recursive: true });

const API = 'https://wiki.bloodontheclocktower.com/api.php';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
    const url = new URL(API);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    const res = await fetch(url, {
        headers: { 'User-Agent': 'botc-wiki-dumper/1.0 (personal use)' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
}

async function listCategoryMembers(categoryTitle) {
    // categoryTitle like: "Category:Experimental Characters"
    let cmcontinue = undefined;
    const titles = [];
    while (true) {
        const data = await api({
            action: 'query',
            format: 'json',
            list: 'categorymembers',
            cmtitle: categoryTitle,
            cmlimit: '500',
            ...(cmcontinue ? { cmcontinue } : {})
        });
        const members = data?.query?.categorymembers ?? [];
        for (const m of members) titles.push(m.title);

        cmcontinue = data?.continue?.cmcontinue;
        if (!cmcontinue) break;
        await sleep(200);
    }
    return titles;
}

async function parsePage(title) {
    // returns HTML + wikitext + some metadata
    const data = await api({
        action: 'parse',
        format: 'json',
        page: title,
        prop: 'text|wikitext|sections',
        redirects: '1'
    });

    const parse = data?.parse;
    if (!parse) throw new Error(`No parse payload for ${title}`);

    return {
        title: parse.title,
        pageid: parse.pageid,
        sections: parse.sections ?? [],
        html: parse.text?.['*'] ?? '',
        wikitext: parse.wikitext?.['*'] ?? ''
    };
}

function safeFileName(title) {
    return title.replace(/[\/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_');
}

async function dumpTitle(title, categoryHint) {
    const record = await parsePage(title);

    const out = {
        source: {
            wiki: 'https://wiki.bloodontheclocktower.com/',
            api: API,
            url: `https://wiki.bloodontheclocktower.com/${encodeURIComponent(title).replaceAll('%2F', '/')}`,
            fetchedAt: new Date().toISOString()
        },
        categoryHint,
        ...record
    };

    const file = path.join(OUT_DIR, `${safeFileName(title)}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 2), 'utf8');
}

async function main() {
    const categories = [
        { title: 'Category:Experimental Characters', hint: 'experimental' },
        { title: 'Category:Travellers', hint: 'traveller' },
        { title: 'Category:Fabled', hint: 'fabled' },
        { title: 'Category:Loric', hint: 'loric' }
        // Optional additional coverage:
        // { title: "Category:Townsfolk", hint: "character_type_townsfolk" },
        // { title: "Category:Outsiders", hint: "character_type_outsider" },
        // { title: "Category:Minions", hint: "character_type_minion" },
        // { title: "Category:Demons", hint: "character_type_demon" },
    ];

    for (const c of categories) {
        console.log(`Listing ${c.title}...`);
        const titles = await listCategoryMembers(c.title);
        console.log(`  Found ${titles.length}`);

        for (const t of titles) {
            console.log(`  Dumping: ${t}`);
            try {
                await dumpTitle(t, c.hint);
            } catch (e) {
                console.error(`    FAILED: ${t} -> ${e.message}`);
            }
            await sleep(250);
        }
    }

    console.log('Done. Output:', OUT_DIR);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
