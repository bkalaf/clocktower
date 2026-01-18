// src/schemas/aliases/zScriptId.ts
import z from 'zod/v4';

export const zScriptId = z.uuid('ScriptId must be a UUID');
