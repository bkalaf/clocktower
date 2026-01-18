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
            playerSeatMap: Record<string, any>;
            stStateVersion: Record<string, any>;
            customScriptRoles: unknown[];
            publicStateVersion: number;
            storytellerUserIds: string;
        },
        events: {} as
            | { type: 'DAWN' }
            | { type: 'DUSK' }
            | { type: 'SETUP_COMPLETE' }
            | { type: 'CLOCKTOWER_GONG' }
            | { type: 'REVEAL_COMPLETE' }
            | { type: 'TRAVELER_DENIED' }
            | { type: 'OPEN_NOMINATIONS' }
            | { type: 'CLOSE_NOMINATIONS' }
            | { type: 'GAME_OVER(winner)' }
            | { type: 'TRAVELER_APPROVED' }
            | { type: 'EXECUTION_OCCURRED' }
            | { type: 'TRAVELER_REQUESTED' }
            | { type: 'ANNOUNCEMENTS_COMPLETE' }
    },
    guards: {
        openTravelerSeats: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        openTravelerRequests: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        }
    }
}).createMachine({
    context: {},
    id: 'MatchMachine',
    type: 'parallel',
    states: {
        setup: {
            on: {
                SETUP_COMPLETE: {
                    target: '#MatchMachine.in_progress.night.resolve_first_night_order'
                }
            }
        },
        in_progress: {
            initial: 'day',
            on: {
                'GAME_OVER(winner)': {
                    target: 'reveal'
                }
            },
            states: {
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
                        execution_resolution: {},
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
                },
                night: {
                    initial: 'resolve_night_order',
                    on: {
                        DAWN: {
                            target: '#MatchMachine.in_progress.day.dawn_announcements'
                        }
                    },
                    states: {
                        resolve_night_order: {},
                        resolve_first_night_order: {}
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
        },
        traveler_requests: {
            type: 'parallel',
            states: {
                empty: {
                    on: {
                        TRAVELER_REQUESTED: {
                            target: 'pending_request',
                            guard: {
                                type: 'openTravelerSeats'
                            },
                            description: 'travelerCountUsed &lt; 5 && canTravel'
                        }
                    }
                },
                pending_request: {
                    on: {
                        TRAVELER_APPROVED: [
                            {
                                target: 'pending_request',
                                guard: {
                                    type: 'openTravelerRequests'
                                }
                            },
                            {
                                target: 'empty'
                            }
                        ],
                        TRAVELER_DENIED: [
                            {
                                target: 'pending_request',
                                guard: {
                                    type: 'openTravelerRequests'
                                }
                            },
                            {
                                target: 'empty'
                            }
                        ]
                    }
                }
            }
        }
    }
});
