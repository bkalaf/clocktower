/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/seed-scripts.ts
//
// Usage (example):
//   ts-node scripts/seed-scripts.ts
//
// Assumes Mongo is running and accessible via MONGODB_URI or localhost default.
// Seeds db "clocktower", collection "script", from editions.json.

import mongoose, { Schema, model } from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// ---- Types (match your global.d.ts) ----
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'veteran';
type CharacterRoles =
    | 'gardener'
    | 'bootlegger'
    | 'spiritofivory'
    | 'sentinel'
    | 'fibbin'
    | 'imp'
    | 'spy'
    | 'scarletwoman'
    | 'baron'
    | 'poisoner'
    | 'drunk'
    | 'saint'
    | 'recluse'
    | 'butler'
    | 'chef'
    | 'librarian'
    | 'washerwoman'
    | 'investigator'
    | 'fortuneteller'
    | 'empath'
    | 'monk'
    | 'undertaker'
    | 'ravenkeeper'
    | 'soldier'
    | 'virgin'
    | 'mayor'
    | 'slayer'
    | 'gunslinger'
    | 'beggar'
    | 'thief'
    | 'bureaucrat'
    | 'scapegoat';

export type Script = {
    _id: string;
    description?: string;
    author?: string;
    skillLevel: SkillLevel;
    roles: CharacterRoles[];
    name: string;
    isOfficial: boolean;
    isPlayable: boolean;
};

const DB_NAME = 'clocktower';
const COLLECTION = 'script';
const EDITIONS_JSON = '/home/bobby/clocktower/src/assets/data/editions.json';

// ---- Enums for Mongoose validation ----
const SkillLevelEnum: readonly SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert', 'veteran'] as const;

const CharacterRolesEnum: readonly CharacterRoles[] = [
    'gardener',
    'bootlegger',
    'spiritofivory',
    'sentinel',
    'fibbin',
    'imp',
    'spy',
    'scarletwoman',
    'baron',
    'poisoner',
    'drunk',
    'saint',
    'recluse',
    'butler',
    'chef',
    'librarian',
    'washerwoman',
    'investigator',
    'fortuneteller',
    'empath',
    'monk',
    'undertaker',
    'ravenkeeper',
    'soldier',
    'virgin',
    'mayor',
    'slayer',
    'gunslinger',
    'beggar',
    'thief',
    'bureaucrat',
    'scapegoat'
] as const;

// ---- Mongoose schema/model ----
const scriptSchema = new Schema<Script>(
    {
        _id: { type: String, required: true },
        description: { type: String, required: false },
        author: { type: String, required: false },
        skillLevel: { type: String, required: true, enum: SkillLevelEnum },
        roles: { type: [String], required: true, default: [] },
        name: { type: String, required: true, trim: true },
        isOfficial: { type: Boolean, required: true, default: false },
        isPlayable: { type: Boolean, required: true, default: true }
    },
    { collection: COLLECTION, timestamps: true }
);

const ScriptModel = mongoose.models.Script ?? model<Script>('Script', scriptSchema);

// ---- Helpers ----
function toScriptish(x: any): Script {
    // Be defensive: editions.json may not be a perfect match.
    const _id = typeof x?._id === 'string' && x._id.length ? x._id : randomUUID();

    return {
        _id,
        name: String(x?.name ?? ''),
        roles: Array.isArray(x?.roles) ? (x.roles as CharacterRoles[]) : [],
        skillLevel: (x?.skillLevel.toLowerCase() as SkillLevel) ?? 'beginner',
        description: typeof x?.description === 'string' ? x.description : undefined,
        author: typeof x?.author === 'string' ? x.author : undefined,
        isOfficial: Boolean(x?.isOfficial ?? false),
        isPlayable: Boolean(x?.isPlayable ?? true)
    };
}

function extractScripts(json: any): any[] {
    // Common shapes:
    // 1) [ { ...script }, ... ]
    // 2) { scripts: [ ... ] }
    // 3) { editions: [ { scripts: [...] }, ... ] } or similar
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.scripts)) return json.scripts;

    // Try to find arrays nested one level down
    for (const v of Object.values(json ?? {})) {
        if (Array.isArray(v)) {
            // maybe editions: [...]
            const maybe = v.flatMap((item) => (Array.isArray(item?.scripts) ? item.scripts : []));
            if (maybe.length) return maybe;
        }
    }

    throw new Error('Could not locate a scripts array in editions.json (unknown structure).');
}

async function main() {
    const mongoUri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

    await mongoose.connect(mongoUri, { dbName: DB_NAME });
    try {
        // 1) Clear collection
        await ScriptModel.deleteMany({});
        console.log(`[seed-scripts] Cleared collection "${COLLECTION}" in db "${DB_NAME}".`);

        // 2) Read JSON
        const raw = await fs.readFile(EDITIONS_JSON, 'utf8');
        const parsed = JSON.parse(raw);

        // 3) Extract scripts + normalize
        const items = extractScripts(parsed).map(toScriptish);

        for await (const element of items.map(el => ScriptModel.insertOne(el))) {
            console.log(element);
        }
        // // 4) Insert
        // if (items.length) {
        //     console.log(items);
        //     const result = await ScriptModel.insertMany(items, { ordered: false });
        //     console.log(result);
        //     console.log(`[seed-scripts] Inserted ${items.length} scripts.`);
        // } else {
        //     console.log('[seed-scripts] No scripts found to insert.');
        // }
    } finally {
    }
}

main().catch((err) => {
    console.error('[seed-scripts] Failed:', err);
});
