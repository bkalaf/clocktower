// src/db/models/Script.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import { zScript } from '../../schemas/api/scripts';

const scriptModels = getTypesFor('script', zScript, { timestamps: true, collection: 'script' }, {}, [
    { scriptId: 1 },
    { unique: true }
]);

export type Script = z.infer<typeof zScript>;
export type ScriptType = mongoose.InferRawDocType<Script>;
export type ScriptDocument = mongoose.HydratedDocument<ScriptType>;
export const ScriptModel = scriptModels.model;
export default scriptModels;
