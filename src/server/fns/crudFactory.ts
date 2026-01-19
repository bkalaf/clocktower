import { createServerFn } from '@tanstack/start';
import { connectMongoose } from '@/db/connectMongoose';
import type { Model } from 'mongoose';
import type { z } from 'zod';
import { bindCommandZod, bindQueryZod } from '@/shared/api/bindingsZod';
import type { EndpointSpec } from '@/shared/api/endpoint';

type AnyObj = Record<string, unknown>;

export function makeMongooseCrud<
    TDoc extends AnyObj,
    TDto,
    TIdKey extends string,
    TGet extends EndpointSpec<'query', any, any>,
    TUpdate extends EndpointSpec<'command', any, any>,
    TDelete extends EndpointSpec<'command', any, any>
>(opts: {
    getEndpoint: TGet;
    updateEndpoint: TUpdate;
    deleteEndpoint: TDelete;

    idKey: TIdKey;
    Model: Model<TDoc>;
    mapDto: (doc: TDoc) => TDto;

    scopeFilter?: (input: z.infer<TGet['input']>, ctx: AnyObj) => AnyObj | Promise<AnyObj>;
}) {
    const { getEndpoint, updateEndpoint, deleteEndpoint, idKey, Model, mapDto, scopeFilter } = opts;

    const getOneFn = createServerFn({ method: 'GET' })
        .inputValidator(getEndpoint.input)
        .handler(async ({ input, context }) => {
            const id = (input as Record<TIdKey, string>)[idKey];
            const extra = scopeFilter ? await scopeFilter(input, context ?? {}) : {};
            await connectMongoose();
            const doc = await Model.findOne({ _id: id, ...extra }).lean();
            if (!doc) throw new Error('Not found');
            return getEndpoint.output.parse({ item: mapDto(doc as TDoc) });
        });

    const updateOneFn = createServerFn({ method: 'POST' })
        .inputValidator(updateEndpoint.input)
        .handler(async ({ input, context }) => {
            const id = (input as Record<TIdKey, string>)[idKey];
            const extra = scopeFilter ? await scopeFilter(input as z.infer<TGet['input']>, context ?? {}) : {};
            await connectMongoose();
            const updateInput = input as z.infer<TUpdate['input']>;
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

    const deleteOneFn = createServerFn({ method: 'POST' })
        .inputValidator(deleteEndpoint.input)
        .handler(async ({ input, context }) => {
            const id = (input as Record<TIdKey, string>)[idKey];
            const extra = scopeFilter ? await scopeFilter(input as z.infer<TGet['input']>, context ?? {}) : {};
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
