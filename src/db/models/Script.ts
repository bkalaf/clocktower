// src/db/models/Script.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { aliases } = schemas;

export const zScriptCharacter = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    team: z.string().min(1),
    icon: z.string().optional().nullable()
});

export const zScript = z.object({
    _id: aliases.scriptId,
    scriptId: aliases.scriptId,
    name: aliases.name,
    isBuiltin: z.boolean().default(true),
    characters: z.array(zScriptCharacter).default([])
});

const scriptModels = getTypesFor(
    'script',
    zScript,
    { timestamps: true, collection: 'script' },
    {},
    [{ scriptId: 1 }, { unique: true }]
);

export type Script = z.infer<typeof zScript>;
export type ScriptType = mongoose.InferRawDocType<Script>;
export type ScriptDocument = mongoose.HydratedDocument<ScriptType>;
export const ScriptModel = scriptModels.model;
export default scriptModels;
