// src/machines/MatchMachine.ts
import { assign, setup } from 'xstate';
import type { Match, MatchPhase, MatchStatus, MatchSubphase } from '../types/match';

type CurrentNomination = {
    nominatorId: string;
    nomineeId: string;
    nominationType: NominationType;
    openedAt: number;
};

type VoteRecord = {
    voterId: string;
    choice: VoteChoice;
    usedGhost?: boolean;
};

type VoteHistoryEntry = {
    day: number;
    nominationType: NominationType;
    nominatorId: string;
    nomineeId: string;
    votesFor: number;
    threshold: number;
    passed: boolean;
    votes: VoteRecord[];
    ts: number;
};

type OnTheBlockStatus = {
    nomineeId: string;
    votesFor: number;
    nominatorId: string;
};

type PendingTravellerRequest = {
    requestId: string;
    userId: string;
};

export type MatchContext = {
    phase: string;
    roomId: string;
    matchId: string;
    matchStatus: MatchStatus;
    scriptId: string;
    subphase: string;
    dayNumber: number;
    playerSeatMap: Record<string, unknown>;
    stStateVersion: Record<string, unknown>;
    customScriptRoles: CharacterRoles[];
    publicStateVersion: Record<string, unknown>;
    storytellerUserIds: string[];
    allowTravelers: boolean;
    travelerCountUsed: PcTravellerCount;
    availableTravelers: Travellers[];
    pendingTravelerRequests: PendingTravellerRequest[];
    dayNominated: string[];
    dayNominators: string[];
    currentNomination: CurrentNomination;
    currentVotes: Record<string, VoteChoice>;
    currentVoteGhostUsage: Record<string, boolean>;
    isAliveById: Record<string, boolean>;
    isTravelerById: Record<string, boolean>;
    ghostVoteAvailableById: Record<string, boolean>;
    onTheBlock: OnTheBlockStatus;
    voteHistory: VoteHistoryEntry[];
};

type MatchPhasePayload = {
    matchId: string;
    phase: MatchPhase;
    subphase: MatchSubphase;
    dayNumber?: number;
    nominationsOpen?: boolean;
    breakoutWhispersEnabled?: boolean;
    playerSeatMap?: MatchContext['playerSeatMap'];
    aliveById?: MatchContext['aliveById'];
    isTravelerById?: MatchContext['isTravelerById'];
    ghostVoteAvailableById?: MatchContext['ghostVoteAvailableById'];
    voteHistory?: MatchContext['voteHistory'];
    onTheBlock?: MatchContext['onTheBlock'];
};

type MatchEvent =
    | { type: 'DAWN' }
    | { type: 'DUSK' }
    | { type: 'CLOCKTOWER_GONG' }
    | { type: 'REVEAL_COMPLETE' }
    | { type: 'OPEN_NOMINATIONS' }
    | { type: 'CLOSE_NOMINATIONS' }
    | { type: 'GAME_OVER'; payload: { winner: string } }
    | { type: 'EXECUTION_OCCURRED' }
    | { type: 'ANNOUNCEMENTS_COMPLETE' }
    | { type: 'SETUP_COMPLETE' }
    | { type: 'TRAVELER_REQUESTED'; requestId: string; userId: string }
    | { type: 'DECIDE_TRAVELER'; requestId: string; decision: string; characterRole: string }
    | {
          type: 'NOMINATION_ATTEMPTED';
          payload: { nominatorId: string; nomineeId: string; nominationType: NominationType };
      }
    | { type: 'VOTE_CAST'; payload: { voterId: string; choice: VoteChoice } }
    | { type: 'VOTE_CLOSED' }
    | { type: 'MATCH_DATA_LOADED'; payload: Match }
    | { type: 'MATCH_PHASE_CHANGED'; payload: MatchPhasePayload }
    | { type: 'MATCH_RESET' };

type GuardMeta = {
    context: MatchContext;
    event: MatchEvent;
};

const initialContext: MatchContext = {
    roomId: '',
    matchId: '',
    matchStatus: 'setup',
    scriptId: '',
    voteHistory: [],
    ghostVoteAvailableById: {},
    isTravelerById: {},
    isAliveById: {},
    onTheBlock: {
        nomineeId: '',
        votesFor: 0,
        nominatorId: ''
    },
    currentNomination: {
        nominatorId: '',
        nomineeId: '',
        nominationType: 'execution',
        openedAt: 0
    },
    phase: 'setup',
    subphase: 'day.dawn_announcements',
    dayNumber: 1,
    playerSeatMap: {},
    stStateVersion: {},
    customScriptRoles: [],
    publicStateVersion: {},
    storytellerUserIds: [],
    allowTravelers: false,
    travelerCountUsed: 0,
    availableTravelers: [],
    pendingTravelerRequests: [],
    dayNominated: [],
    dayNominators: [],
    currentVotes: {},
    currentVoteGhostUsage: {}
};

const canNominateGuard = ({ context, event }: GuardMeta) => {
    if (event.type !== 'NOMINATION_ATTEMPTED') return false;
    const { nominatorId } = event.payload;
    const isAlive = context.isAliveById[nominatorId] ?? false;
    const isTraveler = context.isTravelerById[nominatorId] ?? false;
    const alreadyNominated = context.dayNominators.includes(nominatorId);
    const hasActiveNomination = Boolean(context.currentNomination);
    return isAlive && !isTraveler && !alreadyNominated && !hasActiveNomination;
};

const canBeNominatedGuard = ({ context, event }: GuardMeta) => {
    if (event.type !== 'NOMINATION_ATTEMPTED') return false;
    const { nomineeId, nominationType } = event.payload;
    if (context.dayNominated.includes(nomineeId)) return false;
    const nomineeIsTraveler = context.isTravelerById[nomineeId] ?? false;
    const nomineeIsAlive = context.isAliveById[nomineeId] ?? false;
    if (nominationType === 'execution') {
        return nomineeIsAlive && !nomineeIsTraveler;
    }
    if (nominationType === 'exile') {
        return nomineeIsTraveler;
    }
    return false;
};

const canNominateAndBeNominatedGuard = (meta: GuardMeta) => canNominateGuard(meta) && canBeNominatedGuard(meta);

const canVoteGuard = ({ context, event }: GuardMeta) => {
    if (event.type !== 'VOTE_CAST') return false;
    if (!context.currentNomination) return false;
    const { voterId, choice } = event.payload;
    const isExecution = context.currentNomination.nominationType === 'execution';
    const isAlive = context.isAliveById[voterId] ?? false;
    if (isAlive) return true;
    if (!isExecution) return true;
    if (choice == null) return true;
    const hasGlobalGhost = context.ghostVoteAvailableById[voterId] !== false;
    const usedGhostAlready = Boolean(context.currentVoteGhostUsage[voterId]);
    return hasGlobalGhost || usedGhostAlready;
};

export const machine = setup({
    types: {
        context: initialContext as MatchContext,
        events: {} as MatchEvent
    },
    actions: {
        loadMatchData: assign((_, event) => {
            if (event.type !== 'MATCH_DATA_LOADED') return {};
            const match = event.payload;
            return {
                roomId: match.roomId,
                matchId: match._id,
                matchStatus: match.status,
                phase: match.phase,
                subphase: match.subphase,
                dayNumber: match.dayNumber,
                allowTravelers: match.allowTravelers,
                travelerCountUsed: match.travelerCountUsed,
                travelerUserIds: match.travelerUserIds ?? [],
                playerSeatMap: match.playerSeatMap ?? {},
                nominationsOpen: match.nominationsOpen,
                breakoutWhispersEnabled: match.breakoutWhispersEnabled,
                dayNominated: match.dayNominated ?? [],
                dayNominators: match.dayNominators ?? [],
                aliveById: match.aliveById ?? {},
                isTravelerById: match.isTravelerById ?? {},
                ghostVoteAvailableById: match.ghostVoteAvailableById ?? {},
                voteHistory: match.voteHistory ?? [],
                onTheBlock: match.onTheBlock ?? undefined,
                currentNomination: undefined,
                currentVotes: {},
                currentVoteGhostUsage: {}
            };
        }),
        updateMatchPhase: assign((context, event) => {
            if (event.type !== 'MATCH_PHASE_CHANGED') return {};
            const payload = event.payload;
            return {
                matchId: payload.matchId,
                phase: payload.phase,
                subphase: payload.subphase,
                dayNumber: payload.dayNumber ?? context.dayNumber,
                nominationsOpen: payload.nominationsOpen ?? context.nominationsOpen,
                breakoutWhispersEnabled: payload.breakoutWhispersEnabled ?? context.breakoutWhispersEnabled,
                playerSeatMap: payload.playerSeatMap ?? context.playerSeatMap,
                aliveById: payload.aliveById ?? context.aliveById,
                isTravelerById: payload.isTravelerById ?? context.isTravelerById,
                ghostVoteAvailableById: payload.ghostVoteAvailableById ?? context.ghostVoteAvailableById,
                voteHistory: payload.voteHistory ?? context.voteHistory,
                onTheBlock: payload.onTheBlock ?? context.onTheBlock,
                matchStatus: 'in_progress'
            };
        }),
        resetMatch: assign((context) => ({
            ...initialContext,
            roomId: context.roomId,
            scriptId: context.scriptId
        })),
        autoDenyNotAccepting: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        enqueueRequest: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        autoDenyIneligible: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        approveTraveler: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        resetDailyNominationLimits: assign((context) => ({
            dayNominated: [],
            dayNominators: [],
            currentNomination: undefined,
            currentVotes: {}
        })),
        startNomination: assign(({ context, event }) => {
            if (event.type !== 'NOMINATION_ATTEMPTED') return {};
            const { nominatorId, nomineeId, nominationType } = event.payload;
            const nextNominators =
                context.dayNominators.includes(nominatorId) ?
                    context.dayNominators
                :   [...context.dayNominators, nominatorId];
            const nextNominated =
                context.dayNominated.includes(nomineeId) ? context.dayNominated : [...context.dayNominated, nomineeId];
            return {
                dayNominators: nextNominators,
                dayNominated: nextNominated,
                currentNomination: {
                    nominatorId,
                    nomineeId,
                    nominationType,
                    openedAt: Date.now()
                },
                currentVotes: {},
                currentVoteGhostUsage: {}
            };
        }),
        recordVote: assign(({ context, event }) => {
            if (event.type !== 'VOTE_CAST') return {};
            if (!context.currentNomination) return {};
            const { voterId, choice } = event.payload;
            const isExecution = context.currentNomination.nominationType === 'execution';
            const isAlive = context.isAliveById[voterId] ?? false;
            const isDead = !isAlive;
            const consumesGhostVote = isExecution && isDead && choice !== 'abstain';
            const updatedVotes = {
                ...context.currentVotes,
                [voterId]: choice
            };
            const updatedGhostUsage = { ...context.currentVoteGhostUsage };
            if (consumesGhostVote) {
                updatedGhostUsage[voterId] = true;
            }
            const assignments: Partial<MatchContext> = {
                currentVotes: updatedVotes,
                currentVoteGhostUsage: updatedGhostUsage
            };
            if (consumesGhostVote) {
                const alreadyUsed = Boolean(context.currentVoteGhostUsage[voterId]);
                const hasGhostAvailable = context.ghostVoteAvailableById[voterId] !== false;
                if (!alreadyUsed && hasGhostAvailable) {
                    assignments.ghostVoteAvailableById = {
                        ...context.ghostVoteAvailableById,
                        [voterId]: false
                    };
                }
            }
            return assignments;
        }),
        resolveNomination: assign(({ context }) => {
            const nomination = context.currentNomination;
            if (!nomination) return {};
            const aliveNonTraveler = Object.entries(context.isAliveById).reduce((count, [id, alive]) => {
                if (!alive) return count;
                if (context.isTravelerById[id]) return count;
                return count + 1;
            }, 0);
            const threshold = Math.ceil(aliveNonTraveler / 2);
            const votes: VoteRecord[] = Object.entries(context.currentVotes).map(([voterId, choice]) => ({
                voterId,
                choice,
                ...(context.currentVoteGhostUsage[voterId] ? { usedGhost: true } : {})
            }));
            const votesFor = votes.filter((vote) => vote.choice === 'yes').length;
            const passed = votesFor >= threshold;
            const historyEntry: VoteHistoryEntry = {
                day: context.dayNumber,
                nominationType: nomination.nominationType,
                nominatorId: nomination.nominatorId,
                nomineeId: nomination.nomineeId,
                votesFor,
                threshold,
                passed,
                votes,
                ts: Date.now()
            };
            let updatedOnTheBlock = context.onTheBlock;
            if (passed && nomination.nominationType === 'execution') {
                if (!context.onTheBlock || votesFor > context.onTheBlock.votesFor) {
                    updatedOnTheBlock = {
                        nomineeId: nomination.nomineeId,
                        votesFor,
                        nominatorId: nomination.nominatorId
                    };
                }
            }
            return {
                voteHistory: [...context.voteHistory, historyEntry],
                onTheBlock: updatedOnTheBlock
            };
        }),
        clearNomination: assign(() => ({
            currentNomination: undefined,
            currentVotes: {},
            currentVoteGhostUsage: {}
        }))
    },
    guards: {
        isAllowingTravelers: function ({ context, event }, params) {
            // Add your guard code here
            return context.allowTravelers === true;
        },
        hasCapacity: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        eligibleTraveler: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        approved: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        canNominate: canNominateGuard,
        canBeNominated: canBeNominatedGuard,
        canNominateAndBeNominated: canNominateAndBeNominatedGuard,
        canVote: canVoteGuard
    }
}).createMachine({
    context: initialContext,
    id: 'MatchMachine',
    initial: 'setup',
    on: {
        MATCH_DATA_LOADED: {
            actions: 'loadMatchData'
        },
        MATCH_PHASE_CHANGED: {
            actions: 'updateMatchPhase'
        },
        MATCH_RESET: {
            actions: 'resetMatch'
        }
    },
    states: {
        setup: {
            on: {
                SETUP_COMPLETE: {
                    target: 'in_progress'
                }
            }
        },
        in_progress: {
            type: 'parallel',
            on: {
                GAME_OVER: {
                    target: 'reveal'
                }
            },
            states: {
                phase: {
                    initial: 'night',
                    states: {
                        night: {
                            initial: 'resolve_first_night_order',
                            on: {
                                DAWN: {
                                    target: '#MatchMachine.in_progress.phase.day.dawn_announcements'
                                }
                            },
                            states: {
                                resolve_first_night_order: {},
                                resolve_night_order: {}
                            }
                        },
                        day: {
                            initial: 'dawn_announcements',
                            on: {
                                DUSK: {
                                    target: '#MatchMachine.in_progress.phase.night.resolve_night_order'
                                }
                            },
                            states: {
                                dawn_announcements: {
                                    entry: 'resetDailyNominationLimits',
                                    on: {
                                        EXECUTION_OCCURRED: {
                                            target: 'execution_resolution'
                                        },
                                        ANNOUNCEMENTS_COMPLETE: {
                                            target: 'discussions'
                                        }
                                    }
                                },
                                execution_resolution: {
                                    always: {
                                        target: '#MatchMachine.in_progress.phase.night'
                                    }
                                },
                                discussions: {
                                    initial: 'private_conversations',
                                    on: {
                                        EXECUTION_OCCURRED: {
                                            target: 'execution_resolution'
                                        }
                                    },
                                    states: {
                                        private_conversations: {
                                            on: {
                                                CLOCKTOWER_GONG: {
                                                    target: 'public_conversation'
                                                }
                                            }
                                        },
                                        public_conversation: {
                                            on: {
                                                OPEN_NOMINATIONS: {
                                                    target: 'nominations'
                                                },
                                                EXECUTION_OCCURRED: {
                                                    target: '#MatchMachine.in_progress.phase.day.execution_resolution'
                                                }
                                            }
                                        },
                                        nominations: {
                                            initial: 'nominations_open',
                                            on: {
                                                CLOSE_NOMINATIONS: {
                                                    target: '#MatchMachine.in_progress.phase.day.discussions.public_conversation'
                                                },
                                                EXECUTION_OCCURRED: {
                                                    target: '#MatchMachine.in_progress.phase.day.execution_resolution'
                                                }
                                            },
                                            states: {
                                                nominations_open: {
                                                    on: {
                                                        NOMINATION_ATTEMPTED: {
                                                            target: 'vote_in_progress',
                                                            guard: {
                                                                type: 'canNominateAndBeNominated'
                                                            },
                                                            actions: {
                                                                type: 'startNomination'
                                                            }
                                                        }
                                                    }
                                                },
                                                vote_in_progress: {
                                                    on: {
                                                        VOTE_CAST: {
                                                            actions: {
                                                                type: 'recordVote'
                                                            },
                                                            guard: {
                                                                type: 'canVote'
                                                            }
                                                        },
                                                        VOTE_CLOSED: {
                                                            target: 'nomination_resolve'
                                                        }
                                                    }
                                                },
                                                nomination_resolve: {
                                                    entry: ['resolveNomination', 'clearNomination'],
                                                    always: {
                                                        target: 'nominations_open'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                traveler_admission: {
                    initial: 'routing',
                    states: {
                        routing: {
                            always: [
                                {
                                    target: 'accepting',
                                    guard: {
                                        type: 'isAllowingTravelers'
                                    }
                                },
                                {
                                    target: 'not_accepting'
                                }
                            ]
                        },
                        accepting: {
                            initial: 'routing',
                            states: {
                                routing: {
                                    always: [
                                        {
                                            target: 'capacity_available',
                                            guard: {
                                                type: 'hasCapacity'
                                            }
                                        },
                                        {
                                            target: 'limit_reached'
                                        }
                                    ]
                                },
                                capacity_available: {
                                    on: {
                                        TRAVELER_REQUESTED: [
                                            {
                                                target: 'capacity_available',
                                                actions: {
                                                    type: 'enqueueRequest'
                                                },
                                                guard: {
                                                    type: 'eligibleTraveler'
                                                }
                                            },
                                            {
                                                target: 'capacity_available',
                                                actions: {
                                                    type: 'autoDenyIneligible'
                                                }
                                            }
                                        ],
                                        DECIDE_TRAVELER: [
                                            {
                                                target: 'capacity_available',
                                                actions: {
                                                    type: 'approveTraveler'
                                                },
                                                guard: {
                                                    type: 'approved'
                                                }
                                            },
                                            {
                                                target: 'capacity_available'
                                            }
                                        ]
                                    },
                                    always: [
                                        {
                                            target: 'capacity_available',
                                            guard: {
                                                type: 'hasCapacity'
                                            }
                                        },
                                        {
                                            target: 'limit_reached'
                                        }
                                    ]
                                },
                                limit_reached: {
                                    always: {
                                        target: '#MatchMachine.in_progress.traveler_admission.not_accepting'
                                    }
                                }
                            }
                        },
                        not_accepting: {
                            on: {
                                TRAVELER_REQUESTED: {
                                    target: 'not_accepting',
                                    actions: {
                                        type: 'autoDenyNotAccepting',
                                        params: {
                                            requestId: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        reveal: {
            on: {
                REVEAL_COMPLETE: {
                    target: 'complete'
                }
            }
        },
        complete: {
            type: 'final'
        }
    }
});
