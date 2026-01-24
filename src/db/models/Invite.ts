// src/db/models/Invite.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';

const { aliases, refs } = schemas;

export const zInvite = z.object({
    _id: aliases.inviteId,
    roomId: refs.game,
    invitedUserId: refs.user,
    kind: z.enum(['seat', 'spectator']).default('seat'),
    status: z.enum(['pending', 'accepted', 'canceled', 'expired', 'rejected']).default('pending'),
    createdByUserId: refs.user,
    expiresAt: aliases.timestamp,
    message: z.string().optional().nullable()
});

export type Invite = z.infer<typeof zInvite>;
export type InviteType = mongoose.InferRawDocType<Invite>;
export type InviteDocument = mongoose.HydratedDocument<InviteType>;

const kindOptions = ['seat', 'spectator'] as const;
const statusOptions = ['pending', 'accepted', 'canceled', 'expired', 'rejected'] as const;

const inviteSchema = new mongoose.Schema<Invite>(
    {
        _id: { type: String, required: true },
        roomId: { type: String, required: true },
        invitedUserId: { type: String, required: true },
        kind: { type: String, required: true, enum: kindOptions, default: 'seat' },
        status: { type: String, required: true, enum: statusOptions, default: 'pending' },
        createdByUserId: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        message: { type: String, default: null }
    },
    {
        timestamps: true,
        collection: 'invite'
    }
);

inviteSchema.index({ roomId: 1 });
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const modelName = 'invite';
const existingModel = mongoose.models[modelName] as mongoose.Model<Invite> | undefined;
export const InviteModel = existingModel ?? mongoose.model<Invite>(modelName, inviteSchema);

const inviteModels = {
    schema: inviteSchema,
    model: InviteModel,
    insert: zInvite
};

export default inviteModels;
