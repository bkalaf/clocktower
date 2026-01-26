// src/db/models/Room.ts
import mongoose from 'mongoose';
import schemas from '../../schemas/index';

const { enums } = schemas;

const playerCountOptions = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const;
const travelerCountOptions = [0, 1, 2, 3, 4, 5] as const;
const skillLevelOptions = enums.skillLevel.options;
const roomStatusOptions = enums.roomStatus.options;
const visibilityOptions = enums.roomVisibility.options;

export type Room = {
    _id: string;
    allowTravelers: boolean;
    banner: string;
    connectedUserIds: string[];
    endedAt?: Date | null;
    hostUserId?: string | null;
    maxPlayers?: (typeof playerCountOptions)[number];
    maxTravelers?: (typeof travelerCountOptions)[number];
    minPlayers?: (typeof playerCountOptions)[number];
    plannedStartTime?: Date | null;
    readyByUserId: string[];
    scriptId?: string | null;
    skillLevel: (typeof skillLevelOptions)[number];
    status: (typeof roomStatusOptions)[number];
    storytellerUserIds: string[];
    visibility: (typeof visibilityOptions)[number];
};

export type RoomType = mongoose.InferRawDocType<Room>;
export type RoomDocument = mongoose.HydratedDocument<RoomType>;

const roomSchema = new mongoose.Schema<Room>(
    {
        _id: { type: String, required: true },
        allowTravelers: { type: Boolean, required: true, default: false },
        banner: { type: String, required: true, trim: true },
        connectedUserIds: { type: [String], required: true, default: [] },
        endedAt: { type: Date, default: null },
        hostUserId: { type: String, required: false, default: null },
        maxPlayers: {
            type: Number,
            enum: playerCountOptions,
            default: 15
        },
        maxTravelers: {
            type: Number,
            enum: travelerCountOptions,
            default: 0
        },
        minPlayers: {
            type: Number,
            enum: playerCountOptions,
            default: 5
        },
        plannedStartTime: { type: Date, default: null },
        readyByUserId: { type: [String], required: true, default: [] },
        scriptId: { type: String, required: false, default: null },
        skillLevel: {
            type: String,
            required: true,
            enum: skillLevelOptions,
            default: 'beginner'
        },
        status: {
            type: String,
            required: true,
            enum: roomStatusOptions,
            default: 'closed'
        },
        storytellerUserIds: { type: [String], required: true, default: [] },
        visibility: {
            type: String,
            required: true,
            enum: visibilityOptions,
            default: 'public'
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

const modelName = 'room';
const existingModel = mongoose.models[modelName] as mongoose.Model<Room> | undefined;
export const RoomModel = existingModel ?? mongoose.model<Room>(modelName, roomSchema);

const roomModels = {
    schema: roomSchema,
    model: RoomModel
};

export default roomModels;
