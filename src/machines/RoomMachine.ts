// src/machines/RoomMachine.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { setup, createMachine } from 'xstate';

export const machine = setup({
    types: {
        context: {} as {
            speed: string;
            roomId: string;
            scriptId: string;
            hostUserId: string;
            maxPlayers: number;
            minPlayers: number;
            visibility: string;
            customScript: unknown[];
            readyByUserId: Record<string, boolean>;
            currentMatchId: string;
            storytellerMode: string;
            acceptingPlayers: string;
            connectedUserIds: unknown[];
            plannedStartTime: number;
            storytellerUserIds: unknown[];
            pendingSeatsInviteCount: number;
        },
        events: {} as
            | { type: 'Event 1' }
            | { type: 'OPEN_ROOM' }
            | { type: 'CLOSE_ROOM' }
            | { type: 'START_GAME' }
            | { type: 'MATCH_ENDED' }
            | { type: 'START_MATCH' }
            | { type: 'ARCHIVE_ROOM' }
            | { type: 'CONDITION_MET' }
            | { type: 'READY_CHANGED' }
            | { type: 'HOST_REASSIGNED' }
            | { type: 'COOLDOWN_EXPIRED' }
            | { type: 'HOST_RECONNECTED' }
            | { type: 'HOST_DISCONNECTED' }
            | { type: 'HOST_GRACE_EXPIRED' }
    },
    actions: {
        startTimer: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        cancelTimer: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        reassignHost: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        sendReminderPickStoryteller: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        }
    },
    actors: {
        MatchMachine: createMachine({
            /*
             * MatchMachine
             * https://stately.ai/registry/editor/5c3a42d7-840a-4cca-8642-37b14bdead8a?machine=65b9098f-063f-42b0-8940-fd108d8455f8
             */
        })
    },
    guards: {
        canStartMatch: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        zeroConnected: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        shouldRemindPickST: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        },
        allReady: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            console.log(context, event);
            return true;
        }
    }
}).createMachine({
    context: {},
    id: 'RoomMachine',
    type: 'parallel',
    states: {
        hostContinuity: {
            type: 'parallel',
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
                    },
                    states: {
                        'New state 1': {}
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
                    on: {
                        'Event 1': {
                            target: '#RoomMachine.hostContinuity.host_present.New state 1'
                        }
                    }
                }
            }
        },
        reminders: {
            type: 'parallel',
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
            type: 'parallel',
            states: {
                open: {
                    on: {
                        CLOSE_ROOM: {
                            target: 'closed'
                        },
                        START_GAME: {
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
                        START_GAME: {
                            target: 'in_match',
                            guard: {
                                type: 'canStartMatch'
                            },
                            description:
                                'playerCount between minPlayers/maxPlayers AND storyteller selection rules:\n\nif storyteller mode is human: actor must be storyteller\n\nif storyteller mode is ai: actor must be host\n\nIf scriptId is set'
                        }
                    }
                },
                in_match: {
                    invoke: {
                        input: {},
                        onDone: {
                            target: 'closed'
                        },
                        src: 'MatchMachine'
                    }
                },
                archived: {}
            }
        },
        readiness: {
            type: 'parallel',
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
