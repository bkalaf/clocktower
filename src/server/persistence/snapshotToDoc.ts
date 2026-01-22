import type { ActorRefFrom } from 'xstate';
import { machine as roomMachine } from '@/machines/RoomMachine';

export type RoomSnapshotUpsertArgs = {
    _id: string;
    allowTravellers: boolean;
    banner: string;
    connectedUserIds: string[];
    endedAt?: Date;
    hostUserId: string;
    maxPlayers: PcPlayerCount;
    minPlayers: PcPlayerCount;
    maxTravellers: PcTravellerCount;
    plannedStartTime?: Date;
    scriptId?: string;
    skillLevel?: SkillLevel;
    speed: GameSpeed;
    visibility: RoomVisibility;
    acceptingPlayers: boolean;
    currentMatchId?: string;
    readyByUserId: Record<string, boolean>;
    storytellerMode: StorytellerMode;
    stateValue: unknown;
    persistedSnapshot?: unknown;
};

export function snapshotToUpsertArgs(actor: ActorRefFrom<typeof roomMachine>): RoomSnapshotUpsertArgs {
    const snap = actor.getSnapshot();
    const context = snap.context;

    return {
        _id: context._id,
        allowTravellers: context.allowTravellers,
        banner: context.banner,
        connectedUserIds: Array.isArray(context.connectedUserIds)
            ? context.connectedUserIds
            : Array.from(context.connectedUserIds ?? []),
        endedAt: context.endedAt,
        hostUserId: context.hostUserId,
        maxPlayers: context.maxPlayers,
        minPlayers: context.minPlayers,
        maxTravellers: context.maxTravellers,
        plannedStartTime: context.plannedStartTime,
        scriptId: context.scriptId,
        skillLevel: context.skillLevel,
        speed: context.speed,
        visibility: context.visibility,
        acceptingPlayers: context.acceptingPlayers,
        currentMatchId: context.currentMatchId,
        readyByUserId: context.readyByUserId ?? {},
        storytellerMode: context.storytellerMode,
        stateValue: snap.value,
        persistedSnapshot: actor.getPersistedSnapshot() ?? null
    };
}
