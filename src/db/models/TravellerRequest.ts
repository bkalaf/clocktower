// src/db/models/TravellerRequest.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';

const { aliases, refs } = schemas;

const statusOptions = ['pending', 'approved', 'rejected', 'expired'] as const;

export type TravellerRequestStatus = (typeof statusOptions)[number];

export interface TravellerRequest {
    _id: string;
    matchId: string;
    roomId: string;
    userId: string;
    status: TravellerRequestStatus;
    expiresAt: Date;
    message?: string | null;
}

export const zTravellerRequest = z
    .object({
        _id: aliases.travelerRequestId,
        matchId: refs.match,
        roomId: refs.game,
        userId: refs.user,
        status: z.enum(statusOptions).default('pending'),
        expiresAt: aliases.timestamp,
        message: z.string().optional().nullable()
    })
    .satisfies<z.ZodType<TravellerRequest>>();

export type TravellerRequestType = mongoose.InferRawDocType<TravellerRequest>;
export type TravellerRequestDocument = mongoose.HydratedDocument<TravellerRequestType>;

const statusOptions = ['pending', 'approved', 'rejected', 'expired'] as const;

const travellerRequestSchema = new mongoose.Schema<TravellerRequest>(
    {
        _id: { type: String, required: true },
        matchId: { type: String, required: true },
        roomId: { type: String, required: true },
        userId: { type: String, required: true },
        status: { type: String, required: true, enum: statusOptions, default: 'pending' },
        expiresAt: { type: Date, required: true },
        message: { type: String, default: null }
    },
    {
        timestamps: true,
        collection: 'traveler_request'
    }
);

travellerRequestSchema.index({ matchId: 1 });
travellerRequestSchema.index({ roomId: 1 });
travellerRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const modelName = 'traveler_request';
const existingModel = mongoose.models[modelName] as mongoose.Model<TravellerRequest> | undefined;
export const TravellerRequestModel =
    existingModel ?? mongoose.model<TravellerRequest>(modelName, travellerRequestSchema);

const travellerRequestModels = {
    schema: travellerRequestSchema,
    model: TravellerRequestModel,
    insert: zTravellerRequest
};

export default travellerRequestModels;
