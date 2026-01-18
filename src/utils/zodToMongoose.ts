/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/zodToMongoose.ts
import z from 'zod/v4';
import { JSONSchema, jsonSchemaToMongoose } from './jsonSchemaToMongoose';
import mongoose, { SchemaOptions } from 'mongoose';

export function zodToJSONSchema<Shape extends z.ZodRawShape>(zodObj: z.ZodObject<Shape>) {
    return zodObj.toJSONSchema({
        unrepresentable: 'any',
        override: (ctx) => {
            const def = ctx.zodSchema?._zod?.def;
            const type = def?.type;
            if (typeof ctx.jsonSchema.required === 'boolean') {
                console.log(`ERROR at: ${(def as any)?.path}`);
            }
            if (type === 'any') {
                ctx.jsonSchema.type = 'object';
                return;
            }

            // 1) date => { type: "date" }  (note: not standard JSON Schema)
            if (type === 'date') {
                // ctx.jsonSchema.type = 'date';
                // If you want standard JSON Schema instead, do:
                ctx.jsonSchema.type = 'string';
                ctx.jsonSchema.format = 'date-time';
                return;
            }

            // 2) optional / nullable => keep whatever Zod already produced
            if (type === 'optional' || type === 'nullable') {
                return; // do nothing
            }

            // 3) enum => ensure it has type: "string"
            if (type === 'enum') {
                // Only set if missing so you don't stomp other cases
                if (ctx.jsonSchema.type === undefined) {
                    ctx.jsonSchema.type = 'string';
                }
                return;
            }
        }
    }) as JSONSchema;
}

export function getSchemaFor<Shape extends z.ZodRawShape>(
    zodObj: z.ZodObject<Shape>,
    options: SchemaOptions = {}
): mongoose.Schema<z.infer<typeof zodObj>> {
    const obj = zodToJSONSchema(zodObj);

    return new mongoose.Schema(jsonSchemaToMongoose(obj), options) as any as mongoose.Schema<z.infer<typeof zodObj>>;
}

export function getModelFor<Shape extends z.ZodRawShape>(
    name: string,
    zodObj: z.ZodObject<Shape>,
    options: SchemaOptions = {}
) {
    type Doc = z.infer<typeof zodObj>;
    const schema: mongoose.Schema<Doc> = getSchemaFor(zodObj, options);
    const model =
        (mongoose.models[name] as mongoose.Model<Doc> | undefined) ??
        (mongoose.model(name, schema) as mongoose.Model<Doc>);
    return [schema, model] as [mongoose.Schema<Doc>, mongoose.Model<Doc>];
}

export function defineIndexes<Shape extends z.ZodRawShape>(schema: mongoose.Schema<z.ZodObject<Shape>>) {
    return function (indexes: [Record<string, 1 | -1>, { unique?: boolean; sparse?: boolean }?][]) {
        for (const [fields, opts] of indexes) {
            schema.index(fields, opts);
        }
    };
}

export function getTypesFor<Shape extends z.ZodRawShape, T extends Record<string, any>>(
    name: string,
    zodObj: z.ZodObject<Shape>,
    options: SchemaOptions = {},
    obj: T,
    ...indexes: [Record<string, 1 | -1>, { unique?: boolean; sparse?: boolean; expireAfterSeconds?: number }?][]
) {
    const [schema, model] = getModelFor(name, zodObj, options);

    defineIndexes<Shape>(schema as any)(indexes);
    return {
        schema,
        model,
        insert: zodObj,
        ...obj
    };
}
