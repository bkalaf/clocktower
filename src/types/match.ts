// src/types/match.ts
import { zMatchStatus } from '@/schemas/enums/zMatchStatus';
import { zMatchPhase } from '@/schemas/enums/zMatchPhase';
import { zMatchSubphase } from '@/schemas/enums/zMatchSubphase';
import type { Match as MatchModel } from '@/db/models/Match';
import z from 'zod';

export type MatchStatus = z.infer<typeof zMatchStatus>;
export type MatchPhase = z.infer<typeof zMatchPhase>;
export type MatchSubphase = z.infer<typeof zMatchSubphase>;
export type MatchId = MatchModel['_id'];
export type Match = MatchModel;
