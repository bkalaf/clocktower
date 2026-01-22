// src/db/models/Room.ts
import z from 'zod/v4';
import { zRoom } from '../../schemas/api/rooms';
import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        _id: {
            required: true,
            type: String
        },
        allowTravelers: {
            default: false,
            required: true,
            type: Boolean
        },
        banner: {
            required: true,
            trim: true,
            type: String
        },
        connectedUserIds: [
            {
                required: true,
                type: String
            }
        ],
        endedAt: {
            required: false,
            type: Date
        },
        hostUserId: {
            ref: 'user',
            required: false,
            type: String
        },
        maxPlayers: {
            default: 15,
            enum: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            required: false,
            type: mongoose.Schema.Types.Int32
        },
        maxTravelers: {
            default: 0,
            enum: [0, 1, 2, 3, 4, 5],
            required: false,
            type: mongoose.Schema.Types.Int32
        },
        minPlayers: {
            default: 5,
            enum: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            required: false,
            type: mongoose.Schema.Types.Int32
        },
        plannedStartTime: {
            required: false,
            type: Date
        },
        readyByUserId: [
            {
                required: true,
                type: String
            }
        ],
        scriptId: {
            ref: 'script',
            required: false,
            type: String
        },
        skillLevel: {
            default: 'beginner',
            enum: ['beginner', 'intermediate', 'advanced', 'expert', 'veteran'],
            required: true,
            type: String
        },
        status: {
            default: 'closed',
            enum: ['open', 'closed', 'in_match', 'archived'],
            required: true,
            type: String
        },
        storytellerUserIds: [
            {
                required: true,
                type: String
            }
        ],
        visibility: {
            default: 'public',
            enum: ['public', 'private'],
            required: true,
            type: String
        }
    },
    {
        timestamps: true,
        collection: 'room'
    }
);

roomSchema.index({ hostUserId: 1 });
roomSchema.index({ scriptId: 1 });
roomSchema.index({ connectedUserIds: 1 });

export type Room = z.infer<typeof zRoom>;
export type RoomType = mongoose.InferRawDocType<Room>;
export type RoomDocument = mongoose.HydratedDocument<Room>;
export const RoomModel = mongoose.model<RoomDocument>('Room', roomSchema);
