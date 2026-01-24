// src/db/models/Script.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import enums from '../../schemas/enums';
import { zScript } from '../../schemas/api/scripts';

export type Script = z.infer<typeof zScript>;
export type ScriptType = mongoose.InferRawDocType<Script>;
export type ScriptDocument = mongoose.HydratedDocument<ScriptType>;

const characterRoleOptions = enums.characterRoles.options;
const skillLevelOptions = enums.skillLevel.options;
const editionOptions = enums.editions.options;

const scriptSchema = new mongoose.Schema<Script>(
    {
        _id: { type: String, required: true },
        edition: {
            type: String,
            enum: editionOptions,
            required: false,
            default: undefined
        },
        skillLevel: {
            type: String,
            enum: skillLevelOptions,
            required: true,
            default: 'beginner'
        },
        roles: {
            type: [String],
            enum: characterRoleOptions,
            required: true,
            validate: {
                validator: (value: string[]) => Array.isArray(value) && value.length >= 20,
                message: 'Script must have at least 20 roles.'
            }
        },
        name: { type: String, required: true, minlength: 1, maxlength: 60 },
        isOfficial: { type: Boolean, required: true, default: false }
    },
    {
        timestamps: true,
        collection: 'script'
    }
);

scriptSchema.index({ _id: 1 }, { unique: true });

const modelName = 'script';
const existingModel = mongoose.models[modelName] as mongoose.Model<Script> | undefined;
export const ScriptModel = existingModel ?? mongoose.model<Script>(modelName, scriptSchema);

const scriptModels = {
    schema: scriptSchema,
    model: ScriptModel,
    insert: zScript
};

export default scriptModels;
