// src/machines/RoomMachine.ts
import { assign, AssignArgs, createMachine, setup } from 'xstate';
import type { GameRoles, GameSpeed } from '../types/game';
import type { MatchPhase, MatchStatus, MatchSubphase } from '../types/match';
import type { Room, RoomStatus, RoomVisibility } from '../types/room';
import { randomUUID } from 'crypto';

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
    acceptingPlayers: boolean;
    allowTravellers: boolean;
    banner: string;
    connectedUserIds: string[];
    currentMatchId?: string;
    endedAt?: Date;
    hostUserId: string;
    maxPlayers: PcPlayerCount;
    maxTravellers: PcTravellerCount;
    memberRole?: GameRoles | null;
    minPlayers: PcPlayerCount;
    pendingSeatsInviteCount: number;
    plannedStartTime: Date;
    readyByUserId: Record<string, boolean>;
    _id: string;
    scriptId?: string;
    skillLevel?: SkillLevel;
    speed: GameSpeed;
    storytellerCount: number;
    storytellerMode: StorytellerMode;
    storytellerUserIds: string[];
    visibility: RoomVisibility;
};

type RoomEvents =
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
    _id: randomUUID(),
    scriptId: undefined,
    hostUserId: '',
    visibility: 'public',
    speed: 'moderate',
    maxPlayers: 15,
    minPlayers: 5,
    storytellerMode: 'ai',
    acceptingPlayers: true,
    readyByUserId: {},
    connectedUserIds: [],
    storytellerUserIds: [],
    pendingSeatsInviteCount: 0,
    memberRole: 'player',
    storytellerCount: 0,
    currentMatchId: undefined,
    allowTravellers: false,
    banner: '',
    maxTravellers: 0,
    skillLevel: 'intermediate',
    plannedStartTime: new Date(Date.now())
};

export const machine = setup({
    types: {
        context: initialContext,
        events: {} as RoomEvents
    },
    actions: {
        startTimer: () => {
            // Placeholder for timer integration.
        },
        cancelTimer: () => {
            // Placeholder for timer integration.
        },
        reassignHost: assign(({ context, event }: AssignArgs<RoomContext, RoomEvents>) => {
            if (event.type === 'HOST_CHANGED') {
                return {
                    hostUserId: event.payload.hostUserId
                };
            }
        }),
        sendReminderPickStoryteller: () => {
            // Placeholder for reminder logic.
        },
        applyRoomUpdate: assign((context, event: RoomEvents) => {
            if (event.type !== 'ROOM_UPDATED') return {};
            const { room, memberRole, storytellerCount } = event.payload;
            return {
                room,
                roomId: room._id,
                scriptId: room.scriptId,
                hostUserId: room.hostUserId,
                status: room.status,
                visibility: room.visibility,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QCUD2qC2BZAhgYwAsBLAOzAGJkB5KrAfQFUAFAEQEEAVAURYG0AGALqJQAB1SwiAFyKoSIkAA9EAdgCMAJgB0KgGwBWXQGYVADg2n++gCzWANCACeiU3q2GN13dYCcazRr6GgC+wQ5omLiEpBRMyFwAylwAcgDCXHSpABJsyQDiPALCSCDikjJyCsoIuj7aumoqGpo+Prq6gQ7OCGb8Wr6tuqaWrSoqPqHh6Nj4xGTkWFxYAEJcyHTxbCwAmpk5+YVCCmXSsvIl1boqff7qPkYa-Kat-GpdiEPW-SbWTdeuRn4ukmIAiM2i8yyVASHD2uQKfCOJROFXOoGq6iMWn4Rh8-DqTX0bRU+neCH0wy0Px8el0-BU1lMRmsILBUTmFChMLoeWQbHSdBhbGQ3ERxTEElOlQuH1MXzlJk+TNxmjJvm0Rk0jKsQI0RgaKlZ03ZMXIXNhvP5GVSuXSABlDuLSpLUVUPmZsbino19BSgqSnIhcbotJ5WnLrPxfMMfCywqDjbNTVhONlBRxhaKiscXWc3T01H1rGpI-dTGojEE1LoyYCbq5GUycQzGkbIkn5imOGmmDkknCDmKc+U8zKamMqdYTGZTEN6TiyY8vlrWhpHmHbIb42yOxQu2mUixHcOpWilKo1D5sWpDF4b79NDXAwhC6ZsR1fA1Xp4mkY2+COQWVMsg2RIuA4bNkVzaV0VUR5QwMAwND8axmhvMlNH-E0yC0AgJCkVI5BkEgAFdpEcXD8LoUQACc4DAEgpDNaFYRYABJBJUioZJki4VIsyRCURxg88XzUJl3C8e5NTGRpTAwxltAGHw-TpVDiyw3dKNgAiiNIMipAovCdOoujYAYpjzTodjOO43j+MKNQnRRUdYIQQI+keTVPwaJDUIwoxNS0e4GTpWojABYFt0TCEwG03TGP08j4roKAaPwTkWNArieL4gTnOgs9qhMNRsSk5lL0bIkML1fQtAbNprCJDQOm8TTYviwjEtI5LjKkVL0rwTLuUtAUuAADSYNj4iHKDhKK1RAuC-QZOeCxzF+Gqp2WpsTH0MYVD-aL2w6vquuIgyjKouicFgSQoDICByEgoTT3zYZtH28t9pMctfg0DD-BDD82gsaN9X0dqOS0OiMFICAwBo2AtEkAAbCzyBy9iODY7i6EWCDBOdeb80aK9WlGWd+FecYmowoY3wpml9VeX1GShmIYbAOGSARpGtCkAgaNQKQpHRp6uKoO0WCoAB1ZI6AmqaZpe4m3rHQLtB8BViwaVDY3sZ9qwi-oKe8b19Ew46AM54XMASKQcCkEjkdQUQGMxu1oQyahaFVlyROqZoviZsw6Rp2MA26CwgXqpq8UCBlfjjKYTuhu2MAdp2Xa0N2PaFEV8eA-3CvzYPgopsPqbJunn08J530CS82meUx9o5nCM6z53XfdkggO7ECC-yk9XTHcvQ6piPa+j+4vg8fbxIZCKVI7uKu8dnutDwVGJEgchhWyNiADUfZoLAS5JscVrq82iRJbVXiMRcgjfctAh-ZDqaaNeYembuc47z3k9KgTAUgbHPpfdWblPBviJCVOogJbDU2fnXEkIZmQUnuFYWwmpf4b2zsjIB5knrDyLoPKBY83I3y0HfGkNhLBP0XB0K878bCKjxPcfB-9N6AN3iQgeaZh7HjmtA0SNC6EP0YRWRc5YsRsKuP4KcnxuH214cjUgdAMBO0IIIkCh4RGvSoaJQ6V5DpTkCjiGwtR5J132leTUgRmRhisPgsAOAIAxDutvVAqN0Z4GIlASgXAti7GyPCQxatjFB1eNeQwLNNSXgpIbbolU6oLxxNWQIQRQjxhIKgBG8ASg7liqPVyokAC0l4ySxlKiDSsNhjbGF-mdPSPVDJlMDogZCGF+DIS0CuVC5hLAaEOi0-C50kqGRSrReijFOkLR6CoQGLVaEMmJGYUZbcQjW2wnFVp3VLopTShlBZ+YiTkyBI4y2lgSRR0QI+FQoZcQrSnC0duuytIHIur1a67i7pEAepAM5Y56FUgsFkqw6h-A+BWVif4FhWp6kCkdVONtO7c3hojIpRjylB1hUbX0fQma1BWlYFUbieZ82RmjCyIK3JjHprYdwyp6S+DJmYSlWL+aC2FqLcW9LxF0grqMQE1Z6SaiZU8p4lj1kctMKozO6jBXVFsIuB4fQPDKQfHoSGnyOoEK3nnM8AdFl1EXHUT6j4xWMgiinBMadbY8MIdvfhwLRHRMQKWAZ+JnHNHxLOAwsjYl6ECHKYw+g+m-EVQAjRJAtE6IICqxA9xgaRiJJeYwzx7nuVqFeBeWoH42C3GivZf81EupwDRaIAA3d1uKukIFTbQ9Nfg2grxzR-bQuo6SWCapoNQbiPFeJxVEvF3SCWpLbm+XUrynieHvEOzxZBvF4F8f4wJyalkYVjCGWdN5njjGuIO-V6d3HLrgMjHAfi6A3QgN0BtizGRfHMZGdQupKxPlSbuxuXhfAeBpFFUIQA */
    context: initialContext,
    id: 'RoomMachine',
    type: 'parallel',
    on: {
        ROOM_UPDATED: [{
            type: 'applyRoomUpdate',
            params: ({ context }) => ({
                
            })
        }],
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
