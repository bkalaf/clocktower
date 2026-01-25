// src/lib/scripts.ts
import { createServerFn } from '@tanstack/react-start';
import { connectMongoose } from '@/db/connectMongoose';
import { listAvailableScripts } from '@/server/scripts';
import { ScriptModel } from '@/db/models/Script';
import { characterRoles } from '@/schemas/enums/_enums';
import { z } from 'zod';
import { zScriptId } from '@/schemas/aliases/zScriptId';

const editionOptions = ['tb', 'bmr', 'snv', 'custom'] as const;
const skillLevelOptions = ['beginner', 'intermediate', 'advanced', 'expert', 'veteran'] as const;

const createScriptInput = z.object({
    scriptId: zScriptId,
    name: z.string().min(1, 'Name is required').max(60, 'Name must be 60 characters or less'),
    edition: z.enum(editionOptions).optional().nullable(),
    skillLevel: z.enum(skillLevelOptions).optional(),
    isOfficial: z.boolean().optional()
});

export const listScripts = createServerFn({
    method: 'GET'
}).handler(async () => {
    await connectMongoose();
    const scripts = await listAvailableScripts();
        scripts: scripts.map((script) => ({
            _id: script._id,
            name: script.name,
            edition: script.edition ?? null,
            skillLevel: script.skillLevel ?? 'beginner',
            isOfficial: script.isOfficial ?? false
        }))
    };
});

export const createScript = createServerFn({
    method: 'POST'
})
    .inputValidator(createScriptInput)
    .handler(async ({ data }) => {
        await connectMongoose();
        const document = await ScriptModel.create({
            _id: data.scriptId,
            name: data.name,
            edition: data.edition ?? null,
            skillLevel: data.skillLevel ?? 'beginner',
            isOfficial: data.isOfficial ?? false,
            roles: characterRoles,
            isPlayable: true
        });
        const script = document.toObject();
        return {
            script: {
                _id: script._id,
                name: script.name,
                edition: script.edition ?? null,
                skillLevel: script.skillLevel ?? 'beginner',
                isOfficial: script.isOfficial ?? false
            }
        };
    });
