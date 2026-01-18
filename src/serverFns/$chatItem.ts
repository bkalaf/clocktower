// src/serverFns/$chatItem.ts
import { createServerFn } from '@tanstack/react-start';
import inputs from '../schemas/inputs';
import { connectMongoose } from '../db/connectMongoose';
import $models from '../db/models';

const findByTopicAndStream = createServerFn({
    method: 'GET'
})
    .inputValidator(inputs.chatItem.byTopicAndStream)
    .handler(async ({ data }) => {
        await connectMongoose();
        const result = await $models.ChatItemModel.find(data);
        return result.map((r) => r.toObject());
    });

const $chatItem = {
    find: {
        byTopicAndStream: findByTopicAndStream
    }
};

export default $chatItem;
