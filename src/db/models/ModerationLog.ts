// src/db/models/ModerationLog.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import { getTypesFor } from '../../utils/zodToMongoose';
import schemas from '../../schemas/index';
const { aliases, refs } = schemas;

export const zModerationLog = z.object({
    _id: aliases.moderationLogId,
    roomId: refs.game,
    actorUserId: refs.user,
    targetUserId: refs.user,
    action: z.enum(['removePlayer', 'emptySeat']),
    reasonCode: z.string().min(1),
    message: z.string().optional().nullable(),
    ts: aliases.timestamp.default(() => new Date())
});

const moderationLogModels = getTypesFor(
    'moderation_log',
    zModerationLog,
    { collection: 'moderation_log' },
    {},
    [{ roomId: 1 }]
);

export type ModerationLog = z.infer<typeof zModerationLog>;
export type ModerationLogType = mongoose.InferRawDocType<ModerationLog>;
export type ModerationLogDocument = mongoose.HydratedDocument<ModerationLogType>;
export const ModerationLogModel = moderationLogModels.model;
export default moderationLogModels;
