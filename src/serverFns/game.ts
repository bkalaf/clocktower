// src/serverFns/game.ts

import { createServerFn } from '@tanstack/react-start';
import inputs from '../schemas/inputs';
import $models from '../db/models';
import { connectMongoose } from '../db/connectMongoose';
import type { Game } from '../db/models/_Game';

const findById = createServerFn<'GET', Game>({
    method: 'GET'
})
    .inputValidator(inputs.string)
    .handler(async ({ data: gameId }) => {
        await connectMongoose();
        const result = await $models.GameModel.findById(gameId);
        if (!result) throw new Error(`could not find game from gameId`);
        return result.toObject();
    });

const $game = {
    findById
};

export default $game;
