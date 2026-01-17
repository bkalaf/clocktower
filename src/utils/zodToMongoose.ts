// src/utils/zodToMongoose.ts
import z4 from 'zod/v4';
import { JSONSchema, jsonSchemaToMongoose } from './jsonSchemaToMongoose';
import mongoose, { SchemaOptions } from 'mongoose';

// src/utils/zodToMongoose.ts
export function zodToJSONSchema<Shape extends z4.ZodRawShape>(zodObj: z4.ZodObject<Shape>) {
    return zodObj.toJSONSchema({
        unrepresentable: 'any',
        override: (ctx) => {
            const def = ctx.zodSchema._zod.def;
            if (def.type === 'date') {
                ctx.jsonSchema.bsonType = 'date';
            } else {
                ctx.jsonSchema.bsonType = ctx.jsonSchema.type;
                delete ctx.jsonSchema.type;
            }
        }
    }) as JSONSchema;
}

export function getSchemaFor<Shape extends z4.ZodRawShape>(
    zodObj: z4.ZodObject<Shape>,
    options: SchemaOptions = {}
): mongoose.Schema<z4.infer<typeof zodObj>> {
    const obj = zodToJSONSchema(zodObj);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new mongoose.Schema(jsonSchemaToMongoose(obj), options) as any as mongoose.Schema<z4.infer<typeof zodObj>>;
}

export function getModelFor<Shape extends z4.ZodRawShape>(
    name: string,
    zodObj: z4.ZodObject<Shape>,
    options: SchemaOptions = {}
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Doc = z4.infer<typeof zodObj>;
    const schema: mongoose.Schema<Doc> = getSchemaFor(zodObj, options);
    const model =
        (mongoose.models[name] as mongoose.Model<Doc> | undefined) ??
        (mongoose.model(name, schema) as mongoose.Model<Doc>);
    return [schema, model] as [mongoose.Schema<Doc>, mongoose.Model<Doc>];
}

export function getTypesFor<Shape extends z4.ZodRawShape, T extends Record<string, any>>(
    name: string,
    zodObj: z4.ZodObject<Shape>,
    options: SchemaOptions = {},
    obj: T
) {
    const [schema, model] = getModelFor(name, zodObj, options);
    return {
        schema,
        model,
        insert: zodObj,
        ...obj
    };
}
