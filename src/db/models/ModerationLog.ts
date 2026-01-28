// src/db/models/ModerationLog.ts
import mongoose from 'mongoose';
import z from 'zod/v4';
import schemas from '../../schemas/index';
const { aliases, refs } = schemas;

const actionOptions = ['removePlayer', 'emptySeat'] as const;

export type ModerationAction = (typeof actionOptions)[number];

export interface ModerationLog {
    _id: string;
    roomId: string;
    actorUserId: string;
    targetUserId: string;
    action: ModerationAction;
    reasonCode: string;
    message?: string | null;
    ts: Date;
}

export const zModerationLog = z
    .object({
        _id: aliases.moderationLogId,
        roomId: refs.game,
        actorUserId: refs.user,
        targetUserId: refs.user,
        action: z.enum(actionOptions),
        reasonCode: z.string().min(1),
        message: z.string().optional().nullable(),
        ts: aliases.timestamp.default(() => new Date())
    })
    .satisfies<z.ZodType<ModerationLog>>();

export type ModerationLogType = mongoose.InferRawDocType<ModerationLog>;
export type ModerationLogDocument = mongoose.HydratedDocument<ModerationLogType>;

const moderationLogSchema = new mongoose.Schema<ModerationLog>(
    {
        _id: { type: String, required: true },
        roomId: { type: String, required: true },
        actorUserId: { type: String, required: true },
        targetUserId: { type: String, required: true },
        action: { type: String, required: true, enum: actionOptions },
        reasonCode: { type: String, required: true, minlength: 1 },
        message: { type: String, default: null },
        ts: { type: Date, required: true, default: () => new Date() }
    },
    {
        collection: 'moderation_log'
    }
);

moderationLogSchema.index({ roomId: 1 });

const modelName = 'moderation_log';
const existingModel = mongoose.models[modelName] as mongoose.Model<ModerationLog> | undefined;
export const ModerationLogModel =
    existingModel ?? mongoose.model<ModerationLog>(modelName, moderationLogSchema);

const moderationLogModels = {
    schema: moderationLogSchema,
    model: ModerationLogModel,
    insert: zModerationLog
};

export default moderationLogModels;
