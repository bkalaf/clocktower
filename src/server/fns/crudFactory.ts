// src/server/fns/crudFactory.ts
import { createServerFn } from '@tanstack/react-start';
import { connectMongoose } from '@/db/connectMongoose';
import type { Model } from 'mongoose';
import { bindCommandZod, bindQueryZod } from '@/shared/api/bindingsZod';
import type { EndpointSpec, InferOutput } from '@/shared/api/endpoint';
import z from 'zod/v4';

type AnyObj = Record<string, unknown>;

// export function makeMongoCrud<
//     TPlural extends string,
//     TDto extends z.ZodTypeAny,
//     TType extends z.ZodTypeAny,
//     TListInput extends z.ZodTypeAny,
//     TPatch extends z.ZodObject<{
//         _id: z.ZodString;
//     }>,
//     TCreateInput extends z.ZodTypeAny
// >(
//     {
//         createInput,
//         createOutput,
//         dto,
//         listInput,
//         listOutput,
//         itemOutput,
//         patch,
//         type
//     }: ZodObjects<TPlural, TDto, TType, TListInput, TPatch, TCreateInput>,
//     Model: Model<mongoose.HydratedDocument<TType>>,
//     key: string
// ) {
//     const getOneFn = createServerFn({ method: 'GET' })
//         .inputValidator(
//             z.object({
//                 _id: z.string()
//             })
//         )
//         .handler(async ({ data, context }) => {
//             await connectMongoose();
//             const doc = await Model.findOne(data).lean();
//             if (!doc) throw new Error('Not found');
//             return JSON.stringify({
//                 item: doc.toJSON()
//             });
//         });
//     const updateOneFn = createServerFn({ method: 'POST' })
//         .inputValidator(patch.parse)
//         .handler(async ({ data: { _id, ...data }, context }) => {
//             await connectMongoose();
//             const filter = { _id };
//             const doc = await Model.updateOne(filter, { $set: data } as any);
//             if (doc.modifiedCount === 0) throw new Error('Not found or not permitted');
//             return JSON.stringify({ ok: true });
//         });
//     const deleteOnFn = createServerFn({ method: 'POST' })
//         .inputValidator(z.string())
//         .handler(async ({ data, context }) => {
//             await connectMongoose();
//             const doc = await Model.deleteOne({ _id: data });
//             if (doc.deletedCount === 0) throw new Error('Not found or not permitted');
//             return JSON.stringify({ ok: true });
//         });
//     return {
//         getOne: bindQueryZod({
//             endpoint: {
//                 input: z.object({
//                     _id: z.string()
//                 }),
//                 output: itemOutput,
//                 kind: 'query',
//                 path: ''
//             },
//             fn: getOneFn,
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             getParams: (i) => ({ _id: (i as Record<string, any>)[key] })
//         }),
//         updateOne: bindCommandZod({
//             endpoint: updateEndpoint,
//             fn: updateOneFn
//         }),
//         deleteOne: bindCommandZod({
//             endpoint: deleteEndpoint,
//             fn: deleteOneFn
//         })
//     };
// }

export function makeMongooseCrud<TDoc extends AnyObj, TDto, TIdKey extends string, TIn extends z.ZodTypeAny>(opts: {
    getEndpoint: EndpointSpec<'query', any, any>;
    updateEndpoint: EndpointSpec<'command', any, any>;
    deleteEndpoint: EndpointSpec<'command', any, any>;

    idKey: TIdKey;
    Model: Model<TDoc>;
    mapDto: (doc: TDoc) => TDto;

    scopeFilter?: (input: z.infer<TIn>, ctx: AnyObj) => AnyObj | Promise<AnyObj>;
}) {
    const { getEndpoint, updateEndpoint, deleteEndpoint, idKey, Model, mapDto, scopeFilter } = opts;

    const getOneFn = createServerFn<'GET', InferOutput<typeof getEndpoint>>({ method: 'GET' })
        .inputValidator(getEndpoint.input)
        .handler(async ({ data, context }) => {
            const id = (input as Record<TIdKey, string>)[idKey];
            const extra = scopeFilter ? await scopeFilter(input, context ?? {}) : {};
            await connectMongoose();
            const doc = await Model.findOne({ _id: id, ...extra }).lean();
            if (!doc) throw new Error('Not found');
            return getEndpoint.output.parse({ item: mapDto(doc as TDoc) });
        });

    const updateOneFn = createServerFn<'POST', InferOutput<typeof updateEndpoint>>({ method: 'POST' })
        .inputValidator(updateEndpoint.input)
        .handler(async ({ input, context }) => {
            const id = (input as Record<TIdKey, string>)[idKey];
            const extra = scopeFilter ? await scopeFilter(input as z.infer<TIn>, context ?? {}) : {};
            await connectMongoose();
            const updateInput = input as z.infer<TIn>;
            const patch = updateInput.patch;
            const updated = await Model.findOneAndUpdate(
                { _id: id, ...extra },
                { $set: patch },
                {
                    new: true,
                    lean: true
                }
            );
            if (!updated) throw new Error('Not found or not permitted');
            return updateEndpoint.output.parse({ item: mapDto(updated as TDoc) });
        });

    const deleteOneFn = createServerFn<'POST', InferOutput<typeof deleteEndpoint>>({ method: 'POST' })
        .inputValidator(deleteEndpoint.input)
        .handler(async ({ input, context }) => {
            const id = (input as Record<TIdKey, string>)[idKey];
            const extra = scopeFilter ? await scopeFilter(input as z.infer<TIn>, context ?? {}) : {};
            await connectMongoose();
            const res = await Model.deleteOne({ _id: id, ...extra });
            if (!res.deletedCount) throw new Error('Not found or not permitted');
            return deleteEndpoint.output.parse({ ok: true });
        });

    return {
        getOne: bindQueryZod({
            endpoint: getEndpoint,
            fn: getOneFn,
            getParams: (i) => ({ [idKey]: (i as Record<TIdKey, string>)[idKey] })
        }),
        updateOne: bindCommandZod({
            endpoint: updateEndpoint,
            fn: updateOneFn
        }),
        deleteOne: bindCommandZod({
            endpoint: deleteEndpoint,
            fn: deleteOneFn
        })
    };
}
