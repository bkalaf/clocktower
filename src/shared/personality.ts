// src/shared/personality.ts

export enum TrustModelRank {
    Treacherous = 1, // assumes bad faith, will exploit
    Wary = 2, // skeptical, transactional trust
    Neutral = 3, // situational, mixed signals
    Reliable = 4, // consistent, cooperative
    Honorbound = 5 // principled, protective
}

export enum TableImpactStyleRank {
    Instigator = 1, // stirs conflict, spikes chaos
    Agitator = 2, // pushes drama, escalates
    Balanced = 3, // can swing either way
    Stabilizer = 4, // calms table, reduces chaos
    Anchor = 5 // keeps game coherent, de-escalates
}

export enum ReasoningModeRank {
    Impulsive = 1, // vibes > logic, snap judgments
    Intuitive = 2, // quick heuristics, patterny
    Practical = 3, // decent middle-ground
    Analytical = 4, // evidence-driven, consistent
    Deliberate = 5 // methodical, plans ahead
}

export enum InformationHandlingRank {
    Leaky = 1, // overshares, sloppy secrecy
    Loose = 2, // imperfect discretion
    Normal = 3, // average discipline
    Careful = 4, // guarded, intentional
    Vaultlike = 5 // strict need-to-know
}

export enum VoiceStyleRank {
    Abrasive = 1, // sharp, taunting, cutting
    Spiky = 2, // snarky, provocative
    Plain = 3, // neutral tone
    Warm = 4, // friendly, encouraging
    Gentle = 5 // kind, reassuring
}

export type Personality = {
    trustModel: TrustModelRank;
    tableImpactStyle: TableImpactStyleRank;
    reasoningMode: ReasoningModeRank;
    informationHandling: InformationHandlingRank;
    voiceStyle: VoiceStyleRank;
};
