// src/db/models/game.ts
import mongoose, { Schema } from 'mongoose';
import { Game } from '../../types/game';

const gameSchema = new Schema<Game>(
    {
        _id: { type: String, required: true, index: true },
        version: { type: Number, required: true, default: 0 },
        snapshot: { type: Schema.Types.Mixed, required: true, default: {} }
    },
    {
        timestamps: true
    }
);

export const GameModel = (mongoose.models['Game'] as mongoose.Model<Game>) || mongoose.model('Game', gameSchema);
