import mongoose, { Schema } from 'mongoose';

export type GrimoireArtifactPolicy = 'STORYTELLER_TRUE' | 'MISINFO_DRUNK_POISON' | 'MISINFO_VORTOX';

export interface GrimoireArtifact {
    _id: string;
    matchId: string;
    roomId: string;
    phaseId: string;
    policy: GrimoireArtifactPolicy;
    seed: string;
    revisionHash: string;
    mimeType: 'image/png';
    png: Buffer;
    width?: number;
    height?: number;
    createdAt: number;
}

const artifactSchema = new Schema<GrimoireArtifact>(
    {
        _id: { type: String, required: true },
        matchId: { type: String, required: true },
        roomId: { type: String, required: true },
        phaseId: { type: String, required: true },
        policy: {
            type: String,
            required: true,
            enum: ['STORYTELLER_TRUE', 'MISINFO_DRUNK_POISON', 'MISINFO_VORTOX']
        },
        seed: { type: String, required: true },
        revisionHash: { type: String, required: true },
        mimeType: { type: String, required: true, default: 'image/png' },
        png: { type: Buffer, required: true },
        width: { type: Number },
        height: { type: Number },
        createdAt: { type: Number, required: true, default: Date.now }
    },
    {
        timestamps: false,
        collection: 'grimoire_artifacts'
    }
);

artifactSchema.index({ matchId: 1, phaseId: 1 });

const modelName = 'grimoire_artifact';
const existingModel = mongoose.models[modelName] as mongoose.Model<GrimoireArtifact> | undefined;
export const GrimoireArtifactModel = existingModel ?? mongoose.model<GrimoireArtifact>(modelName, artifactSchema);
