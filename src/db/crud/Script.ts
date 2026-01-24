// src/db/crud/Script.ts
import { createServerFn } from '@tanstack/react-start';
import { ScriptModel } from '../models/Script';
import z from 'zod/v4';
import enums from '../../schemas/enums';

const characterRole = enums.characterRoles;
const skillLevel = enums.skillLevel;

const zScriptFind = z.object({
    isOfficial: z.boolean().optional(),
    skillLevel: skillLevel.optional(),
    roles: z.array(characterRole).default([]),
    name: z.string().optional(),
    isPlayable: z.boolean().optional()
});

export const getScriptById = createServerFn({
    method: 'GET'
})
    .inputValidator(z.string().optional())
    .handler(async ({ data: _id }) => {
        if (!_id) return undefined;
        return await ScriptModel.findById(_id).lean();
    });

export const getAllScripts = createServerFn({
    method: 'GET'
})
    .inputValidator(zScriptFind)
    .handler(async ({ data: filter }) => {
        return await ScriptModel.find(filter).lean();
    });
