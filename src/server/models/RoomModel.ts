// src/server/models/RoomModel.ts
import mongoose from 'mongoose';

type ConnectedUsers = Record<string, unknown> | string[];

export type RoomSnapshotDoc = {
    _id: string;
    allowTravellers: boolean;
    banner: string;
    connectedUserIds: ConnectedUsers;
    endedAt?: Date;
    hostUserId: string;
    maxPlayers: PcPlayerCount;
    minPlayers: PcPlayerCount;
    maxTravellers: PcTravellerCount;
    plannedStartTime?: Date;
    scriptId?: string;
    skillLevel: SkillLevel;
    speed: GameSpeed;
    visibility: RoomVisibility;
    acceptingPlayers: boolean;
    currentMatchId?: string;
    readyByUserId: Record<string, boolean>;
    storytellerMode: StorytellerMode;
    stateValue: unknown;
    persistedSnapshot?: unknown;
};

export type RoomSnapshotDocument = mongoose.Document<unknown, {}, RoomSnapshotDoc> & RoomSnapshotDoc;

const roomSnapshotSchema = new mongoose.Schema<RoomSnapshotDocument>(
    {
        _id: {
            required: true,
            type: String
        },
        allowTravellers: {
            required: true,
            type: Boolean,
            default: false
        },
        banner: {
            required: true,
            type: String,
            trim: true,
            default: ''
        },
        connectedUserIds: {
            default: [],
            required: true,
            type: mongoose.Schema.Types.Mixed
        },
        endedAt: {
            required: false,
            type: Date
        },
        hostUserId: {
            required: true,
            type: String
        },
        maxPlayers: {
            required: true,
            enum: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            type: Number,
            default: 15
        },
        minPlayers: {
            required: true,
            enum: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            type: Number,
            default: 5
        },
        maxTravellers: {
            required: true,
            enum: [0, 1, 2, 3, 4, 5],
            type: Number,
            default: 0
        },
        plannedStartTime: {
            required: false,
            type: Date
        },
        scriptId: {
            required: false,
            type: String
        },
        skillLevel: {
            required: true,
            enum: ['beginner', 'intermediate', 'advanced', 'expert', 'veteran'],
            type: String,
            default: 'beginner'
        },
        speed: {
            required: true,
            enum: ['slow', 'moderate', 'fast'],
            type: String,
            default: 'moderate'
        },
        visibility: {
            required: true,
            enum: ['public', 'private'],
            type: String,
            default: 'public'
        },
        acceptingPlayers: {
            required: true,
            type: Boolean,
            default: true
        },
        currentMatchId: {
            required: false,
            type: String
        },
        readyByUserId: {
            required: true,
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        storytellerMode: {
            required: true,
            enum: ['ai', 'human'],
            type: String,
            default: 'ai'
        },
        stateValue: {
            required: true,
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        persistedSnapshot: {
            required: false,
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        collection: 'room_snapshot',
        timestamps: true
    }
);

roomSnapshotSchema.index({ hostUserId: 1 });
roomSnapshotSchema.index({ visibility: 1 });
roomSnapshotSchema.index({ plannedStartTime: 1 });
roomSnapshotSchema.index({ endedAt: 1 });

export type RoomSnapshotLean = RoomSnapshotDoc;
export const RoomModel =
    mongoose.models.RoomSnapshot ?? mongoose.model<RoomSnapshotDocument>('RoomSnapshot', roomSnapshotSchema);
