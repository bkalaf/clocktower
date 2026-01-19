// src/serverFns/whisper.ts

import { WhisperModel } from '@/db/models/Whisper';
import { GameId, UserId } from '../types/game';

const find = async (gameId: GameId, member?: UserId, isActive = true) =>
    await WhisperModel.find(member ? { gameId, isActive, members: member } : { gameId, isActive }).lean();

const $whisper = {
    find
};

export default $whisper;
