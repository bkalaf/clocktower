import mongoose from 'mongoose';
import type { Personality } from '../../shared/personality';

export type AiUserRecord = {
    _id: string;
    username: string;
    pronouns?: string;
    personality: Personality;
};

export type AiUserDocument = mongoose.Document<unknown, {}, AiUserRecord> & AiUserRecord;

const personalitySchema = new mongoose.Schema<AiUserRecord['personality']>(
    {
        trustModel: {
            enum: [1, 2, 3, 4, 5],
            max: 5,
            min: 1,
            required: true,
            type: Number
        },
        tableImpactStyle: {
            enum: [1, 2, 3, 4, 5],
            max: 5,
            min: 1,
            required: true,
            type: Number
        },
        reasoningMode: {
            enum: [1, 2, 3, 4, 5],
            max: 5,
            min: 1,
            required: true,
            type: Number
        },
        informationHandling: {
            enum: [1, 2, 3, 4, 5],
            max: 5,
            min: 1,
            required: true,
            type: Number
        },
        voiceStyle: {
            enum: [1, 2, 3, 4, 5],
            max: 5,
            min: 1,
            required: true,
            type: Number
        }
    },
    { _id: false }
);

const aiUserSchema = new mongoose.Schema<AiUserDocument>(
    {
        _id: {
            required: true,
            type: String
        },
        username: {
            required: true,
            trim: true,
            type: String,
            unique: true,
            lowercase: true
        },
        pronouns: {
            type: String,
            trim: true
        },
        personality: {
            required: true,
            type: personalitySchema
        }
    },
    {
        collection: 'aiUsers',
        timestamps: true
    }
);

aiUserSchema.index({ username: 1 }, { unique: true });

export const AiUserModel =
    mongoose.models.AiUser ?? mongoose.model<AiUserDocument>('AiUser', aiUserSchema);
