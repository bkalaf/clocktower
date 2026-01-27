// src/server/screenshot/types.ts
export type ScreenshotPolicy = 'STORYTELLER_TRUE' | 'MISINFO_DRUNK_POISON' | 'MISINFO_VORTOX';
export type ScreenshotStatus = 'queued' | 'awaiting_storyteller' | 'rendering' | 'done' | 'failed';

export type SeatOverride = {
    seatId: number;
    roleId: string;
    roleName: string;
    alignment?: Alignments;
    note?: string;
};

export type MisinfoPlan = {
    overrides: SeatOverride[];
    note?: string;
};

export type GrimoireSeatView = {
    seatId: number;
    playerName: string;
    roleId: string;
    roleName: string;
    alignment: Alignments | 'unknown';
    isAlive: boolean;
    tags: string[];
    reminders: string[];
};

export type GrimoireViewModel = {
    matchId: string;
    roomId: string;
    phaseId: string;
    phaseLabel: string;
    dayNumber: number;
    phase: 'day' | 'night';
    seats: GrimoireSeatView[];
    activeNotes: string[];
    misinfoNote?: string;
    policy: ScreenshotPolicy;
    seed: string;
    recipientPlayerId: string;
};

export type TruthSnapshot = {
    matchId: string;
    roomId: string;
    dayNumber: number;
    phase: 'night' | 'day';
    phaseTag: string;
    seats: Record<number, SeatInfo>;
    tokens: Record<number, RoleReference>;
    alivePlayers: number[];
    pendingDeaths: number[];
};

export type RoleReference = {
    id: string;
    name: string;
    characterType?: string;
};

export type SeatInfo = {
    id: number;
    userId?: string;
    username: string;
    type: 'human' | 'ai';
    pronouns?: string;
};

export type ScreenshotJob = {
    id: string;
    gameId: string;
    matchId: string;
    roomId: string;
    phaseId: string;
    recipientPlayerId: string;
    seatId: number;
    policy: ScreenshotPolicy;
    seed: string;
    revisionHash: string;
    status: ScreenshotStatus;
    expiresAt: number;
    pngBuffer?: Buffer;
    viewModel?: GrimoireViewModel;
    misinfoPlan?: MisinfoPlan;
    lastError?: string;
    createdAt: number;
    ackedAt?: number;
};
