// src/server/screenshot/view.ts
import crypto from 'node:crypto';
import type { GrimoireViewModel, TruthSnapshot, MisinfoPlan } from './types';

const GOOD_TYPES = new Set(['townsfolk', 'traveller', 'outsider']);

function alignmentFromCharacterType(characterType?: string): 'good' | 'evil' | 'unknown' {
    if (!characterType) return 'unknown';
    return GOOD_TYPES.has(characterType) ? 'good' : 'evil';
}

function formatPhaseLabel(phaseId: string, dayNumber: number, phase: 'night' | 'day', phaseTag: string) {
    const phaseName = phase === 'night' ? 'Night' : 'Day';
    const tag = phaseTag ? ` · ${phaseTag}` : '';
    return `${phaseName} ${dayNumber}${tag}`;
}

export function deriveGrimoireView(
    truth: TruthSnapshot,
    args: {
        policy: GrimoireViewModel['policy'];
        seed: string;
        recipientPlayerId: string;
        phaseId: string;
        misinfoPlan?: MisinfoPlan;
    }
): GrimoireViewModel {
    const seatIds = Object.keys(truth.seats)
        .map((value) => Number(value))
        .sort((a, b) => a - b);

    const seats = seatIds.map((seatId) => {
        const seat = truth.seats[seatId];
        const token = truth.tokens[seatId];
        const isAlive = truth.alivePlayers.includes(seatId);
        const roleName = token?.name ?? 'Unknown';
        const alignment = alignmentFromCharacterType(token?.characterType);
        const tags: string[] = [];
        if (isAlive) {
            tags.push('alive');
        } else {
            tags.push('dead');
        }
        if (seat.userId === args.recipientPlayerId) {
            tags.push('you');
        }
        return {
            seatId,
            playerName: seat.username || `Seat ${seatId}`,
            roleId: token?.id ?? 'unknown',
            roleName,
            alignment,
            isAlive,
            tags,
            reminders: []
        };
    });

    const activeNotes: string[] = [];
    if (truth.pendingDeaths.length) {
        activeNotes.push(`Pending deaths: ${truth.pendingDeaths.join(', ')}`);
    }

    const baseView: GrimoireViewModel = {
        matchId: truth.matchId,
        roomId: truth.roomId,
        phaseId: args.phaseId,
        phaseLabel: formatPhaseLabel(args.phaseId, truth.dayNumber, truth.phase, truth.phaseTag),
        dayNumber: truth.dayNumber,
        phase: truth.phase,
        seats,
        activeNotes,
        misinfoNote: args.misinfoPlan?.note,
        policy: args.policy,
        seed: args.seed,
        recipientPlayerId: args.recipientPlayerId
    };

    if (!args.misinfoPlan) {
        return baseView;
    }

    return applyMisinfoPlan(baseView, args.misinfoPlan);
}

export function applyMisinfoPlan(view: GrimoireViewModel, plan: MisinfoPlan): GrimoireViewModel {
    const seatMap = new Map(view.seats.map((seat) => [seat.seatId, { ...seat }]));

    for (const override of plan.overrides) {
        const seat = seatMap.get(override.seatId);
        if (!seat) continue;
        seat.roleId = override.roleId;
        seat.roleName = override.roleName;
        if (override.alignment) {
            seat.alignment = override.alignment;
        }
        if (override.note) {
            seat.tags = [...seat.tags, override.note];
        }
        seatMap.set(seat.seatId, seat);
    }

    return {
        ...view,
        seats: Array.from(seatMap.values()),
        misinfoNote: plan.note ?? view.misinfoNote
    };
}

export function computeRevisionHash(truth: TruthSnapshot, args: { policy: string; seed: string; recipientPlayerId: string; phaseId: string; misinfoPlan?: MisinfoPlan }) {
    const normalized: Record<string, unknown> = {
        phaseId: args.phaseId,
        policy: args.policy,
        seed: args.seed,
        recipient: args.recipientPlayerId,
        misinfoPlan: args.misinfoPlan,
        truth: {
            dayNumber: truth.dayNumber,
            phase: truth.phase,
            tokens: truth.tokens,
            alivePlayers: truth.alivePlayers,
            pendingDeaths: truth.pendingDeaths
        }
    };
    const digest = crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
    return digest.slice(0, 20);
}
