/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/jsonSchemaToMongoose.ts
import mongoose from 'mongoose';

export type JSONSchema =
    | {
          type?: string | string[];
          properties?: Record<string, JSONSchema>;
          required?: string[];
          items?: JSONSchema;
          enum?: any[];
          const?: any;
          format?: string;

          $ref?: string;
          // string validations
          minLength?: number;
          maxLength?: number;
          pattern?: string;

          // number validations
          minimum?: number;
          maximum?: number;

          // object validations
          additionalProperties?: boolean | JSONSchema;

          // passthrough extras
          default?: any;
          description?: string;

          // unions (basic handling)
          anyOf?: JSONSchema[];
          oneOf?: JSONSchema[];
          allOf?: JSONSchema[];
      }
    | boolean;
type RefResolver = (ref: string) => string;
// ---- public API ----
export function jsonSchemaToMongoose(
    schema: JSONSchema,
    opts: { strict?: boolean; refResolver?: RefResolver } = {}
): Record<string, any> {
    console.log(`schema`, schema);
    if (!schema || schema === true) {
        // true/false schemas are too abstract; treat as Mixed
        return { type: mongoose.Schema.Types.Mixed };
    }

    const ctx = { path: [], refResolver: opts.refResolver };
    const def = schemaToMongooseField(schema, ctx);

    // If top-level is an object with properties, return its properties mapping
    if (isObjectSchema(schema) && schema.properties) {
        return def; // def is already { key: field, ... }
    }

    // Otherwise wrap under a single field name is on you; here we return a single field def
    return { value: def };
}

function defaultRefResolver(ref: string): string {
    // "#/definitions/User" or "#/$defs/User"
    const m = ref.match(/#\/(?:definitions|\$defs)\/([^/]+)$/);
    if (m) return m[1];

    // last path segment of a URL-ish ref
    const tail = ref.split('/').pop();
    return tail ? decodeURIComponent(tail) : ref;
}
// ---- internals ----
function schemaToMongooseField(
    schema: Exclude<JSONSchema, boolean> & { $ref?: string },
    ctx: { path: string[]; refResolver?: RefResolver }
): any {
    if (schema.type === 'object' && Object.keys(schema).length === 1) {
        return { type: mongoose.Schema.Types.Mixed };
    }
    if (schema.$ref) {
        const refName = (ctx.refResolver ?? defaultRefResolver)(schema.$ref);

        // If the node claims it's a string (or doesn't specify), treat as an ObjectId ref
        const schemaTypes = normalizeTypes(schema.type);
        const isStringish = !schema.type || schemaTypes.includes('string');

        if (isStringish) {
            // Common pattern: store foreign keys as ObjectId
            return applyCommonOptions(schema, {
                type: mongoose.Schema.Types.String,
                ref: refName
            });
        }

        // otherwise, fall back to Mixed (or you can expand with real $ref resolution)
        return { type: mongoose.Schema.Types.Mixed };
    }
    // Handle composition keywords (basic)
    if (schema.allOf?.length) {
        // naive merge: later wins
        return schema.allOf.reduce((acc, s) => deepMerge(acc, schemaToMongooseField(s as any, ctx)), {});
    }
    if (schema.oneOf?.length || schema.anyOf?.length) {
        // Mongoose doesn't do union types well; safest is Mixed + optional enum narrowing if common
        const variants = schema.oneOf ?? schema.anyOf ?? [];
        console.log(`variants`, variants);
        const filtered = variants.filter((x) => (x as any).type !== 'null');
        if (variants.length === filtered.length) {
            const consts = variants.filter((x) => Object.keys(x).includes('const'));
            if (consts.length === variants.length) {
                if ((consts[0] as Exclude<JSONSchema, boolean>).type === 'number') {
                    return {
                        type: mongoose.Schema.Types.Int32,
                        enum: variants.map((x) => (x as Exclude<JSONSchema, boolean>).const) as number[]
                    };
                }
            }
        }
        console.log(`filtered`, filtered);
        if (filtered.length === 1) {
            const $dt = filtered[0] as Exclude<JSONSchema, boolean>;
            console.log(`$dt`, $dt);
            const { type, ...dt } = $dt;
            if (type === 'string') {
                if (dt.format === 'uuid') {
                    return { ...dt, type: mongoose.Schema.Types.String };
                } else if (dt.format === 'date-time') {
                    return { ...dt, type: mongoose.Schema.Types.Date };
                }
                return { ...dt, type: mongoose.Schema.Types.String };
            } else if (type === 'number') {
                return { ...dt, type: mongoose.Schema.Types.Double };
            } else if (type === 'integer') {
                return { ...dt, type: mongoose.Schema.Types.String };
            }
            return { type: mongoose.Schema.Types.Mixed };
        }
        const enums = variants.map((v) => (v as any).enum).filter(Boolean);
        if (enums.length === variants.length) {
            const mergedEnum = Array.from(new Set(enums.flat()));
            return { type: mongoose.Schema.Types.String, enum: mergedEnum };
        }
        return { type: mongoose.Schema.Types.Mixed };
    }

    // const
    if ('const' in schema) {
        return { type: mongoose.Schema.Types.Mixed, enum: [schema.const] };
    }

    // enum
    if (schema.enum) {
        // infer type from first enum value when possible
        const t = inferTypeFromValue(schema.enum[0]);
        return applyCommonOptions(schema, { type: t, enum: schema.enum });
    }

    const schemaTypes = normalizeTypes(schema.type);

    // null-only
    if (schemaTypes.length === 1 && schemaTypes[0] === 'null') {
        // Mongoose has no "null type"; represent as Mixed with validator via enum
        return { type: mongoose.Schema.Types.Mixed, enum: [null] };
    }

    // mixed union with null e.g. ["string","null"]
    if (schemaTypes.includes('null') && schemaTypes.length > 1) {
        // We'll mark required: false at property-level; field type is based on the non-null part
        const nonNull = schemaTypes.filter((t) => t !== 'null');
        const base = schemaToMongooseField(
            { ...schema, type: nonNull.length === 1 ? nonNull[0] : nonNull } as any,
            ctx
        );
        // No direct place to encode "nullable" in mongoose; treat as not-required and allow null at app level.
        return base;
    }

    // format shortcuts
    if (schema.format === 'date-time') {
        return applyCommonOptions(schema, { type: Date });
    }
    if (schema.format === 'uuid') {
        return { ...schema, type: mongoose.Schema.Types.String };
    }

    // type-based mapping
    if (schemaTypes.includes('object') || isObjectSchema(schema)) {
        return objectSchemaToMongoose(schema, ctx);
    }

    if (schemaTypes.includes('array')) {
        const itemDef =
            schema.items ?
                schemaToMongooseField(schema.items as any, { path: ctx.path.concat(['[]']) })
            :   { type: mongoose.Schema.Types.Mixed };
        return applyCommonOptions(schema, [itemDef]);
    }

    if (schemaTypes.includes('string')) {
        const field: any = { type: String };
        if (typeof schema.minLength === 'number') field.minLength = schema.minLength;
        if (typeof schema.maxLength === 'number') field.maxLength = schema.maxLength;
        if (typeof schema.pattern === 'string') field.match = new RegExp(schema.pattern);
        return applyCommonOptions(schema, field);
    }

    if (schemaTypes.includes('integer') || schemaTypes.includes('number')) {
        const field: any = { type: Number };
        if (typeof schema.minimum === 'number') field.min = schema.minimum;
        if (typeof schema.maximum === 'number') field.max = schema.maximum;
        return applyCommonOptions(schema, field);
    }

    if (schemaTypes.includes('boolean')) {
        return applyCommonOptions(schema, { type: Boolean });
    }

    // fallback
    return applyCommonOptions(schema, { type: mongoose.Schema.Types.Mixed });
}

function objectSchemaToMongoose(schema: any, ctx: { path: string[] }) {
    // dictionary/map case: { type:"object", additionalProperties: { ... } }
    if (schema.additionalProperties && !schema.properties) {
        const valueSchema =
            schema.additionalProperties === true ?
                { type: mongoose.Schema.Types.Mixed }
            :   schemaToMongooseField(schema.additionalProperties, { path: ctx.path.concat(['{}']) });

        return applyCommonOptions(schema, {
            type: Map,
            of: valueSchema
        });
    }

    const props = schema.properties ?? {};
    const required = new Set<string>(schema.required ?? []);
    const out: Record<string, any> = {};

    for (const [key, propSchema] of Object.entries(props)) {
        const field = schemaToMongooseField(propSchema as any, { path: ctx.path.concat([key]) });

        // Mongoose required is a field-level option, not part of type
        if (isPlainObject(field)) {
            out[key] = { ...field, required: required.has(key) };
        } else {
            // arrays are represented as [subdef]; to apply required you wrap it
            out[key] = { type: field, required: required.has(key) };
        }
    }

    return out;
}

function applyCommonOptions(schema: any, fieldDef: any) {
    // Attach default if present (mongoose uses `default`)
    if (schema.default !== undefined) {
        if (isPlainObject(fieldDef)) return { ...fieldDef, default: schema.default };
        // arrays: wrap
        return { type: fieldDef, default: schema.default };
    }
    return fieldDef;
}

function normalizeTypes(t?: string | string[]) {
    if (!t) return [];
    return Array.isArray(t) ? t : [t];
}

function isObjectSchema(schema: any) {
    return schema && typeof schema === 'object' && (schema.type === 'object' || 'properties' in schema);
}

function inferTypeFromValue(v: any) {
    if (v === null || v === undefined) return mongoose.Schema.Types.Mixed;
    if (v instanceof Date) return Date;
    switch (typeof v) {
        case 'string':
            return String;
        case 'number':
            return Number;
        case 'boolean':
            return Boolean;
        default:
            return mongoose.Schema.Types.Mixed;
    }
}

function isPlainObject(x: any) {
    return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function deepMerge(a: any, b: any) {
    if (!isPlainObject(a) || !isPlainObject(b)) return b;
    const out: any = { ...a };
    for (const [k, v] of Object.entries(b)) {
        out[k] = k in out ? deepMerge(out[k], v) : v;
    }
    return out;
}
