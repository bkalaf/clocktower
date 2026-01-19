// src/machines/RoomMachine.ts
import { setup, createMachine } from 'xstate';

export const machine = setup({
    types: {
        context: {
            speed: 'moderate',
            maxPlayers: 15,
            minPlayers: 5,
            visibility: 'public',
            readyByUserId: {},
            storytellerMode: 'ai',
            acceptingPlayers: true,
            connectedUserIds: [],
            storytellerUserIds: [],
            pendingSeatsInviteCount: 0,
            beenNominated: [],
            nominated: [],
            history: []
        } as {
            speed: GameSpeed;
            roomId?: string;
            scriptId?: string;
            hostUserId?: string;
            maxPlayers: PcPlayerCount;
            minPlayers: PcPlayerCount;
            visibility: RoomVisibility;
            customScript?: CharacterRoles[];
            readyByUserId: Record<string, boolean>;
            currentMatchId?: string;
            storytellerMode: StorytellerMode;
            acceptingPlayers: boolean;
            connectedUserIds: string[];
            plannedStartTime?: number;
            storytellerUserIds: string[];
            pendingSeatsInviteCount: number;
            beenNominated: string[];
            nominated: string[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            history: any[];
        },
        events: {} as
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
    },
    actions: {
        startTimer: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        cancelTimer: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        reassignHost: function ({ context, event }, params) {
            // Add your action code here
            // ...
        },
        sendReminderPickStoryteller: function ({ context, event }, params) {
            // Add your action code here
            // ...
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
        canStartMatch: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        zeroConnected: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        shouldRemindPickST: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        allReady: function ({ context, event }) {
            // Add your guard condition here
            return true;
        }
    }
}).createMachine({
    context: {
        speed: 'moderate',
        maxPlayers: 15,
        minPlayers: 5,
        visibility: 'public',
        readyByUserId: {},
        storytellerMode: 'ai',
        acceptingPlayers: true,
        connectedUserIds: [],
        storytellerUserIds: [],
        pendingSeatsInviteCount: 0,
        beenNominated: [],
        nominated: [],
        history: []
    },
    id: 'RoomMachine',
    type: 'parallel',
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
                        }
                    }
                },
                in_match: {
                    invoke: {
                        id: 'match',
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
