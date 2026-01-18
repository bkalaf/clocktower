// src/db/models/Invite.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
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

const inviteModels = getTypesFor(
    'invite',
    zInvite,
    { timestamps: true, collection: 'invite' },
    {},
    [{ roomId: 1 }],
    [{ expiresAt: 1 }, { expireAfterSeconds: 0 }]
);

export type Invite = z.infer<typeof zInvite>;
export type InviteType = mongoose.InferRawDocType<Invite>;
export type InviteDocument = mongoose.HydratedDocument<InviteType>;
export const InviteModel = inviteModels.model;
export default inviteModels;
