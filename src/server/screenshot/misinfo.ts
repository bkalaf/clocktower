// src/server/screenshot/misinfo.ts
import crypto from 'node:crypto';
import type { TruthSnapshot, MisinfoPlan, SeatOverride } from './types';

function deterministicRandom(seed: string) {
    let counter = 0;
    return () => {
        const ctx = `${seed}:${counter++}`;
        const hash = crypto.createHash('sha256').update(ctx).digest('hex');
        const value = parseInt(hash.slice(0, 8), 16);
        return value / 0xffffffff;
    };
}

function alignmentFromType(characterType?: string): Alignments {
    if (!characterType) return 'unknown';
    const good = ['townsfolk', 'traveller', 'outsider'];
    return good.includes(characterType) ? 'good' : 'evil';
}

export function supportsMisinfo(policy: string) {
    return policy !== 'STORYTELLER_TRUE';
}

export function generateMisinfoPlan(truth: TruthSnapshot, policy: string, args: { seed: string; recipientPlayerId: string }): MisinfoPlan | undefined {
    if (!supportsMisinfo(policy)) return undefined;

    const aliveSeatIds = truth.alivePlayers.filter((seatId) => truth.seats[seatId]);
    if (aliveSeatIds.length < 2) return { overrides: [] };

    const rng = deterministicRandom(`${args.seed}:${policy}:${args.recipientPlayerId}`);
    const firstIndex = Math.floor(rng() * aliveSeatIds.length);
    let secondIndex = Math.floor(rng() * (aliveSeatIds.length - 1));
    if (secondIndex >= firstIndex) {
        secondIndex += 1;
    }

    const seatA = aliveSeatIds[firstIndex];
    const seatB = aliveSeatIds[secondIndex];
    const roleA = truth.tokens[seatA];
    const roleB = truth.tokens[seatB];

    if (!roleA || !roleB) {
        return { overrides: [] };
    }

    const overrides: SeatOverride[] = [
        {
            seatId: seatA,
            roleId: roleB.id,
            roleName: roleB.name,
            alignment: alignmentFromType(roleB.characterType),
            note: `MISINFO (${policy})`
        },
        {
            seatId: seatB,
            roleId: roleA.id,
            roleName: roleA.name,
            alignment: alignmentFromType(roleA.characterType),
            note: `MISINFO (${policy})`
        }
    ];

    return {
        overrides,
        note: `${roleA.name} and ${roleB.name} switch places for ${policy}`
    };
}
