// src/server/scripts/index.ts
import { connectMongoose } from '../../db/connectMongoose';
import { ScriptModel } from '../../db/models/Script';
import { builtinScripts } from '../../data/scripts';

export async function seedBuiltinScripts() {
    await connectMongoose();
    await Promise.all(
        builtinScripts.map((script) =>
            ScriptModel.updateOne({ scriptId: script.scriptId }, { $set: script }, { upsert: true })
        )
    );
}

export async function listAvailableScripts() {
    await seedBuiltinScripts();
    return ScriptModel.find().sort({ isBuiltin: -1, name: 1 }).lean();
}

export async function getScript(scriptId: string) {
    await seedBuiltinScripts();
    return ScriptModel.findOne({ scriptId }).lean();
}
