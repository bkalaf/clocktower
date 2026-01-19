// src/machines/RoomMachine.ts
import { assign, createMachine, setup } from 'xstate';
import type { GameRoles, GameSpeed } from '../types/game';
import type { MatchPhase, MatchStatus, MatchSubphase } from '../types/match';
import type { Room, RoomLobbySettings, RoomStatus, RoomVisibility } from '../types/room';

type HostGraceState = {
    hostUserId: string;
    untilTs: number;
};

type PresencePayload = {
    connectedUserIds: string[];
    userId: string;
    status: 'connected' | 'disconnected';
};

type RoomUpdatePayload = {
    room: Room;
    memberRole: GameRoles;
    storytellerCount: number;
};

type MatchPhaseSummary = {
    matchId: string;
    phase: MatchPhase;
    subphase: MatchSubphase;
    dayNumber?: number;
    nominationsOpen?: boolean;
    breakoutWhispersEnabled?: boolean;
};

export type RoomContext = {
    room?: Room;
    roomId?: string;
    scriptId?: string;
    hostUserId?: string;
    status: RoomStatus;
    visibility: RoomVisibility;
    speed: GameSpeed;
    maxPlayers: PcPlayerCount;
    minPlayers: PcPlayerCount;
    customScript?: CharacterRoles[];
    storytellerMode: StorytellerMode;
    acceptingPlayers: boolean;
    readyByUserId: Record<string, boolean>;
    connectedUserIds: string[];
    storytellerUserIds: string[];
    pendingSeatsInviteCount: number;
    beenNominated: string[];
    nominated: string[];
    history: unknown[];
    lobbySettings?: RoomLobbySettings | null;
    memberRole?: GameRoles | null;
    storytellerCount: number;
    currentMatchId?: string;
    matchPhase?: MatchPhase;
    matchSubphase?: MatchSubphase;
    dayNumber: number;
    nominationsOpen?: boolean;
    hostGrace?: HostGraceState | null;
    matchStatus: MatchStatus;
};

type RoomEvent =
    | { type: 'OPEN_ROOM' }
    | { type: 'CLOSE_ROOM' }
    | { type: 'MATCH_ENDED' }
    | { type: 'START_MATCH' }
    | { type: 'ARCHIVE_ROOM' }
    | { type: 'CONDITION_MET' }
    | { type: 'READY_CHANGED' }
    | { type: 'COOLDOWN_EXPIRED' }
    | { type: 'HOST_RECONNECTED' }
    | { type: 'HOST_DISCONNECTED' }
    | { type: 'HOST_GRACE_EXPIRED' }
    | { type: 'ROOM_UPDATED'; payload: RoomUpdatePayload }
    | { type: 'PRESENCE_CHANGED'; payload: PresencePayload }
    | { type: 'MEMBER_READY_CHANGED'; payload: { userId: string; isReady: boolean } }
    | { type: 'HOST_CHANGED'; payload: { hostUserId: string } }
    | { type: 'HOST_GRACE_STARTED'; payload: HostGraceState }
    | { type: 'HOST_GRACE_CANCELED' }
    | { type: 'MATCH_STARTED'; payload: { matchId: string } }
    | { type: 'MATCH_PHASE_CHANGED'; payload: MatchPhaseSummary }
    | { type: 'MATCH_RESET' };

const initialContext: RoomContext = {
    room: undefined,
    roomId: undefined,
    scriptId: undefined,
    hostUserId: undefined,
    status: 'open',
    visibility: 'public',
    speed: 'moderate',
    maxPlayers: 15,
    minPlayers: 5,
    customScript: undefined,
    storytellerMode: 'ai',
    acceptingPlayers: true,
    readyByUserId: {},
    connectedUserIds: [],
    storytellerUserIds: [],
    pendingSeatsInviteCount: 0,
    beenNominated: [],
    nominated: [],
    history: [],
    lobbySettings: undefined,
    memberRole: null,
    storytellerCount: 0,
    currentMatchId: undefined,
    matchPhase: undefined,
    matchSubphase: undefined,
    dayNumber: 1,
    nominationsOpen: false,
    hostGrace: null,
    matchStatus: 'setup'
};

export const machine = setup({
    types: {
        context: initialContext,
        events: {} as RoomEvent
    },
    actions: {
        startTimer: () => {
            // Placeholder for timer integration.
        },
        cancelTimer: () => {
            // Placeholder for timer integration.
        },
        reassignHost: () => {
            // Placeholder for host reassignment side effects.
        },
        sendReminderPickStoryteller: () => {
            // Placeholder for reminder logic.
        },
        applyRoomUpdate: assign((context, event) => {
            if (event.type !== 'ROOM_UPDATED') return {};
            const { room, memberRole, storytellerCount } = event.payload;
            return {
                room,
                roomId: room._id,
                scriptId: room.scriptId,
                hostUserId: room.hostUserId,
                status: room.status,
                visibility: room.visibility,
                lobbySettings: room.lobbySettings ?? context.lobbySettings,
                memberRole,
                storytellerCount
            };
        }),
        applyPresence: assign((context, event) => {
            if (event.type !== 'PRESENCE_CHANGED') return {};
            return {
                connectedUserIds: event.payload.connectedUserIds
            };
        }),
        applyMemberReady: assign((context, event) => {
            if (event.type !== 'MEMBER_READY_CHANGED') return {};
            return {
                readyByUserId: {
                    ...context.readyByUserId,
                    [event.payload.userId]: event.payload.isReady
                }
            };
        }),
        applyHostChanged: assign((_, event) => {
            if (event.type !== 'HOST_CHANGED') return {};
            return {
                hostUserId: event.payload.hostUserId
            };
        }),
        applyHostGraceStarted: assign((_, event) => {
            if (event.type !== 'HOST_GRACE_STARTED') return {};
            return {
                hostGrace: event.payload
            };
        }),
        applyHostGraceCanceled: assign(() => ({
            hostGrace: null
        })),
        applyMatchStart: assign((context, event) => {
            if (event.type !== 'MATCH_STARTED') return {};
            return {
                currentMatchId: event.payload.matchId,
                matchStatus: 'in_progress',
                status: 'in_match'
            };
        }),
        applyMatchPhase: assign((context, event) => {
            if (event.type !== 'MATCH_PHASE_CHANGED') return {};
            return {
                currentMatchId: event.payload.matchId,
                matchPhase: event.payload.phase,
                matchSubphase: event.payload.subphase,
                dayNumber: event.payload.dayNumber ?? context.dayNumber,
                nominationsOpen: event.payload.nominationsOpen ?? context.nominationsOpen,
                matchStatus: 'in_progress'
            };
        }),
        clearMatch: assign(() => ({
            currentMatchId: undefined,
            matchPhase: undefined,
            matchSubphase: undefined,
            nominationsOpen: false,
            matchStatus: 'complete'
        }))
    },
    guards: {
        canStartMatch: ({ context }) => context.connectedUserIds.length >= context.minPlayers,
        zeroConnected: ({ context }) => context.connectedUserIds.length === 0,
        shouldRemindPickST: ({ context }) =>
            context.storytellerCount === 0 && context.connectedUserIds.length >= context.minPlayers,
        allReady: ({ context }) => {
            if (context.connectedUserIds.length === 0) return false;
            return context.connectedUserIds.every((id) => context.readyByUserId[id] === true);
        }
    }
}).createMachine({
    context: initialContext,
    id: 'RoomMachine',
    type: 'parallel',
    on: {
        ROOM_UPDATED: {
            actions: 'applyRoomUpdate'
        },
        PRESENCE_CHANGED: {
            actions: 'applyPresence'
        },
        MEMBER_READY_CHANGED: {
            actions: 'applyMemberReady'
        },
        HOST_CHANGED: {
            actions: 'applyHostChanged'
        },
        HOST_GRACE_STARTED: {
            actions: 'applyHostGraceStarted'
        },
        HOST_GRACE_CANCELED: {
            actions: 'applyHostGraceCanceled'
        },
        MATCH_STARTED: {
            actions: 'applyMatchStart'
        },
        MATCH_PHASE_CHANGED: {
            actions: 'applyMatchPhase'
        },
        MATCH_ENDED: {
            actions: 'clearMatch'
        },
        MATCH_RESET: {
            actions: 'clearMatch'
        }
    },
    states: {
        hostContinuity: {
            initial: 'host_present',
            states: {
                host_present: {
                    on: {
                        HOST_DISCONNECTED: [
                            {
                                target: '#RoomMachine.roomStatus.archived',
                                guard: {
                                    type: 'zeroConnected'
                                },
                                description: 'connectedCount===0'
                            },
                            {
                                target: 'host_grace',
                                actions: {
                                    type: 'startTimer'
                                }
                            }
                        ]
                    }
                },
                host_grace: {
                    on: {
                        HOST_RECONNECTED: {
                            target: 'host_present',
                            actions: {
                                type: 'cancelTimer'
                            }
                        },
                        HOST_GRACE_EXPIRED: {
                            target: 'host_reassigned',
                            actions: {
                                type: 'reassignHost'
                            }
                        }
                    }
                },
                host_reassigned: {
                    always: {
                        target: 'host_present'
                    }
                }
            }
        },
        reminders: {
            initial: 'silent',
            states: {
                silent: {
                    on: {
                        CONDITION_MET: {
                            target: 'throttled',
                            actions: {
                                type: 'sendReminderPickStoryteller'
                            },
                            guard: {
                                type: 'shouldRemindPickST'
                            },
                            description: 'storytellerCount==0 and (minPlayers met or plannedStartTime passed)'
                        }
                    }
                },
                throttled: {
                    on: {
                        COOLDOWN_EXPIRED: {
                            target: 'silent'
                        }
                    }
                }
            }
        },
        roomStatus: {
            initial: 'open',
            states: {
                open: {
                    on: {
                        CLOSE_ROOM: {
                            target: 'closed'
                        },
                        START_MATCH: {
                            target: 'in_match'
                        },
                        MATCH_STARTED: {
                            target: 'in_match'
                        }
                    }
                },
                closed: {
                    on: {
                        ARCHIVE_ROOM: {
                            target: 'archived'
                        },
                        OPEN_ROOM: {
                            target: 'open'
                        },
                        START_MATCH: {
                            target: 'in_match',
                            guard: {
                                type: 'canStartMatch'
                            },
                            description:
                                'playerCount between minPlayers/maxPlayers AND storyteller selection rules:\n\nif storyteller mode is human: actor must be storyteller\n\nif storyteller mode is ai: actor must be host\n\nIf scriptId is set'
                        },
                        MATCH_STARTED: {
                            target: 'in_match'
                        }
                    }
                },
                in_match: {
                    on: {
                        MATCH_ENDED: {
                            target: 'closed'
                        }
                    }
                },
                archived: {}
            }
        },
        readiness: {
            initial: 'collecting',
            states: {
                collecting: {
                    on: {
                        READY_CHANGED: {
                            target: 'all_ready',
                            guard: {
                                type: 'allReady'
                            }
                        }
                    }
                },
                all_ready: {}
            }
        }
    }
});
