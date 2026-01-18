// src/db/models/TravelerRequest.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { aliases, refs } = schemas;

export const zTravelerRequest = z.object({
    _id: aliases.travelerRequestId,
    matchId: refs.match,
    roomId: refs.game,
    userId: refs.user,
    status: z.enum(['pending', 'approved', 'rejected', 'expired']).default('pending'),
    expiresAt: aliases.timestamp,
    message: z.string().optional().nullable()
});

const travelerRequestModels = getTypesFor(
    'traveler_request',
    zTravelerRequest,
    { timestamps: true, collection: 'traveler_request' },
    {},
    [{ matchId: 1 }, { roomId: 1 }],
    [{ expiresAt: 1 }, { expireAfterSeconds: 0 }]
);

export type TravelerRequest = z.infer<typeof zTravelerRequest>;
export type TravelerRequestType = mongoose.InferRawDocType<TravelerRequest>;
export type TravelerRequestDocument = mongoose.HydratedDocument<TravelerRequestType>;
export const TravelerRequestModel = travelerRequestModels.model;
export default travelerRequestModels;
