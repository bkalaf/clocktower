// src/machines/MatchMachine.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup } from 'xstate';

export const machine = setup({
    types: {
        context: {} as {
            phase: string;
            roomId: string;
            matchId: string;
            scriptId: string;
            subphase: string;
            dayNumber: number;
            playerSeatMap: {};
            stStateVersion: {};
            customScriptRoles: unknown[];
            publicStateVersion: number;
            storytellerUserIds: string;
            acceptTravelers: boolean;
            travelerCountUsed: number;
            availableTravelers: unknown[];
            pendingTravelerRequests: unknown[];
        },
        events: {} as
            | { type: 'DAWN' }
            | { type: 'DUSK' }
            | { type: 'CLOCKTOWER_GONG' }
            | { type: 'REVEAL_COMPLETE' }
            | { type: 'OPEN_NOMINATIONS' }
            | { type: 'CLOSE_NOMINATIONS' }
            | { type: 'GAME_OVER(winner)' }
            | { type: 'EXECUTION_OCCURRED' }
            | { type: 'ANNOUNCEMENTS_COMPLETE' }
            | { type: 'SETUP_COMPLETE' }
            | { type: 'TRAVELER_REQUESTED'; requestId: string; userId: string }
            | {
                  type: 'DECIDE_TRAVELER';
                  requestId: string;
                  decision: string;
                  characterRole: string;
              }
    },
    actions: {
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
        }
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
        }
    }
}).createMachine({
    context: {},
    id: 'MatchMachine',
    initial: 'setup',
    states: {
        setup: {
            on: {
                SETUP_COMPLETE: {
                    target: 'in_progress'
                }
            }
        },
        in_progress: {
            initial: 'night',
            on: {
                'GAME_OVER(winner)': {
                    target: 'reveal'
                }
            },
            states: {
                night: {
                    initial: 'resolve_first_night_order',
                    on: {
                        DAWN: {
                            target: '#MatchMachine.in_progress.day.dawn_announcements'
                        }
                    },
                    always: {
                        target: 'traveler_admission'
                    },
                    states: {
                        resolve_first_night_order: {},
                        resolve_night_order: {}
                    }
                },
                traveler_admission: {
                    type: 'parallel',
                    states: {
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
                        },
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
                        }
                    }
                },
                day: {
                    initial: 'dawn_announcements',
                    on: {
                        DUSK: {
                            target: '#MatchMachine.in_progress.night.resolve_night_order'
                        }
                    },
                    states: {
                        dawn_announcements: {
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
                                target: '#MatchMachine.in_progress.night'
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
                                        }
                                    }
                                },
                                nominations: {
                                    initial: 'open',
                                    on: {
                                        EXECUTION_OCCURRED: {
                                            target: '#MatchMachine.in_progress.day.execution_resolution'
                                        }
                                    },
                                    states: {
                                        open: {
                                            on: {
                                                CLOSE_NOMINATIONS: {
                                                    target: 'closed'
                                                }
                                            }
                                        },
                                        closed: {}
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