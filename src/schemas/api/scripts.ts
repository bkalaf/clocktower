// src/schemas/api/scripts.ts
import z from 'zod/v4';
import aliases from '../aliases';
import enums from '../enums';

export const zScript = z.object({
    _id: aliases.scriptId,
    edition: enums.editions.optional().nullable(),
    skillLevel: enums.skillLevel.default('beginner'),
    roles: z.array(enums.characterRoles).min(20, 'Script must have at least 20 roles'),
    name: z.string().min(1, 'Name is required').max(60, 'Name must be 60 characters or less'),
    isOfficial: z.boolean().default(false),
    isPlayable: z.boolean().default(false)
});

export type Script = {
    _id: string;
    edition?: Editions;
    skillLevel: SkillLevel;
    roles: CharacterRoles[];
    name: string;
    isOfficial: boolean;
    isPlayable: boolean;
};

export const zScriptDto = z.object({
    _id: aliases.scriptId,
    edition: enums.editions.nullable().optional(),
    skillLevel: enums.skillLevel,
    roles: z.array(enums.characterRoles),
    name: z.string(),
    isOfficial: z.boolean()
});

export const zScriptListInput = z.object({
    q: z.string().min(1).optional(),
    officialOnly: z.boolean().optional()
});

export const zScriptListResponse = z.object({
    scripts: z.array(zScriptDto)
});

export const zScriptPatch = z
    .object({
        edition: enums.editions.nullable().optional(),
        skillLevel: enums.skillLevel.nullable().optional(),
        roles: z.array(enums.characterRoles).nullable().optional(),
        name: z.string().nullable().optional(),
        isOfficial: z.boolean().nullable().optional()
    })
    .strict();

export const zCreateScriptInput = z.object({
    _id: aliases.scriptId,
    edition: enums.editions.optional().nullable(),
    skillLevel: enums.skillLevel.default('beginner'),
    roles: z.array(enums.characterRoles).min(20, 'Script must have at least 20 roles'),
    name: z.string().min(1, 'Name is required').max(60, 'Name must be 60 characters or less'),
    isOfficial: z.boolean().default(false)
});

export const zCreateScriptOutput = z.object({
    _id: aliases._id
});
export const zScriptItemOutput = z.object({
    item: zScriptDto
});
export const zScriptDeleteOutput = z.object({
    ok: z.literal(true)
});

export type ListOutput<TPlural extends string, TDto extends z.ZodTypeAny> = z.ZodObject<{
    [P in TPlural]: z.ZodArray<TDto>;
}>;

export default {
    type: zScript,
    dto: zScriptDto,
    listInput: zScriptListInput,
    listOutput: zScriptListResponse,
    patch: zScriptPatch,
    createInput: zCreateScriptInput,
    createOutput: zCreateScriptOutput,
    itemOutput: zScriptItemOutput,
    deleteOutput: zScriptDeleteOutput
};
