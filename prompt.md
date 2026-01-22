# ROOMMACHINE

i need a state machine called RoomMachine that takes an initial argument of Room, see global.d.ts attached. Room should go into context as room, along wtih the following acceptingPlayers a boolean default true, currentMatchId a string (optional) (default: undefined), readyByUserId a Record<string, boolean> default: {}, and storytellerMode a StorytellerMode default 'ai'.
    export type Room = {
        _id: string;
        allowTravellers: boolean;
        banner: string;
        connectedUserIds: Record<string, GameRoles>;
        endedAt?: Date;
        hostUserId: string;
        maxPlayers: PcPlayerCount;
        minPlayers: PcPlayerCount;
        maxTravellers: PcTravellerCount;
        plannedStartTime?: Date;
        scriptId: string;
        skillLevel: SkillLevel;
        speed: GameSpeed;
        visibility: RoomVisibility;
    };
default for room should be : {
    _id: randomUUID(),
    allowTravellers: false,
    banner: '',
    connectedUserIds: {},
    hostUserId: '',
    maxPlayers: 15,
    minPlayers: 5,
    maxTravellers: 0,
    skillLevel: 'beginner',
    speed: 'moderate',
    visibility: 'public'
} 

events should be : type RoomEvents =
    | { type: 'OPEN_ROOM' }
    | { type: 'CLOSE_ROOM' }
    | { type: 'MATCH_ENDED' }
    | { type: 'START_MATCH'; numberOfPlayers: number }
    | { type: 'ARCHIVE_ROOM' }
    | { type: 'ROOM_UPDATED'; payload: RoomUpdatePayload }
    | { type: 'READY_CHANGED'; userId: string; isReady: boolean }
    | { type: 'MATCH_STARTED'; payload: { matchId: string } }
    | { type: 'MATCH_PHASE_CHANGED'; payload: MatchPhaseSummary }
    | { type: 'MATCH_RESET' };

RoomMachine should be parallel with the following states:
    roomStatus
        roomStatus.open
            event CLOSE_ROOM -> roomStatus.closed
            event START_MATCH -> roomStatus.in_game
                only if readiness.all_ready
        roomStatus.closed
            event ARCHIVE_ROOM -> roomStatus.archived
            event OPEN_ROOM -> roomStatus.open
            event START_MATCH -> roomStatus.in_game
                only if readiness.all_ready
        roomStatus.archived
            exit
        roomStatus.in_game
            invoke: GameMachine
            id: game
            input: (should take the value of context.maxPlayers)
            onDone: move to roomStatus.closed
    readiness
        readiness.collecting (initial)
            event READY_CHANGED(userId, isReady)
                should call changeReady({ context }, params: { userId, isReady }) {
                    const next = context.readyByUserId = { ...context.readyByUserId, [userId]: isReady }
                    const isAllReady = Object.values(next).every(x => x === true);
                    if (isAllReady) // move to readiness.all_ready
                    return {
                        readyByUserId: next
                    }
                }
        readiness.all_ready 
            event READY_CHANGED(userId, isReady) 
                should call changeReady just like above but instead of if (isAllReady) it should be if (!isAllReady) // move to readiness.collecting
    