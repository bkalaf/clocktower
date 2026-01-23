// src/server/machines/RoomMachine.ts
import { setup, assign, stateIn } from 'xstate';
import { randomUUID } from 'crypto';
import { GameMachine } from './GameMachine';

// If these exist elsewhere in your codebase, delete these aliases and import/use the real ones.
// The user-provided event union references them but they were not in global.d.ts.
export type RoomUpdatePayload = Partial<Room>;
export type MatchPhaseSummary = unknown;

// If GameMachine exists, import it and replace the placeholder below.

// export type Room = {
//     _id: string;
//     allowTravellers: boolean;
//     banner: string;
//     connectedUserIds: Record<string, GameRoles>;
//     endedAt?: Date;
//     hostUserId: string;
//     maxPlayers: PcPlayerCount;
//     minPlayers: PcPlayerCount;
//     maxTravellers: PcTravellerCount;
//     plannedStartTime?: Date;
//     scriptId?: string;
//     skillLevel: SkillLevel;
//     speed: GameSpeed;
//     visibility: RoomVisibility;
// };

type RoomMachineInput = { room?: Partial<Room> };

const defaultRoom = (): Room => ({
    _id: randomUUID(),
    allowTravellers: false,
    banner: '',
    connectedUserIds: {},
    hostUserId: '',
    // If PcPlayerCount / PcTravellerCount are narrower unions, these casts keep TS happy.
    maxPlayers: 15 as PcPlayerCount,
    minPlayers: 5 as PcPlayerCount,
    maxTravellers: 0 as PcTravellerCount,
    skillLevel: 'beginner',
    speed: 'moderate',
    visibility: 'public'
});

/**
 * Factory: creates a RoomMachine with an initial Room (or partial Room) merged over defaults.
 */
export const createRoomMachine = (initialRoom?: Partial<Room>) =>
    setup({
        actors: {
            game: GameMachine
        },
        types: {} as {
            context: RoomContext;
            events: RoomEvents;
            input: RoomMachineInput | undefined;
        },
        guards: {
            readinessAllReadyAfterChange: ({ context, event }) => {
                if (event.type !== 'READY_CHANGED') return false;
                const next = { ...context.readyByUserId, [event.userId]: event.isReady };
                return Object.values(next).every((x) => x === true);
            },
            readinessNotAllReadyAfterChange: ({ context, event }) => {
                if (event.type !== 'READY_CHANGED') return false;
                const next = { ...context.readyByUserId, [event.userId]: event.isReady };
                return !Object.values(next).every((x) => x === true);
            },
            isAllReadyNow: ({ context }) => Object.values(context.readyByUserId).every((x) => x === true)
        },
        actions: {
            changeReady: assign(({ context, event }) => {
                if (event.type !== 'READY_CHANGED') return {};
                const next = { ...context.readyByUserId, [event.userId]: event.isReady };
                return { readyByUserId: next };
            }),

            applyRoomUpdate: assign(({ context, event }) => {
                if (event.type !== 'ROOM_UPDATED') return {};
                // Treat payload as partial room patch. Adjust if your RoomUpdatePayload is different.
                return { room: { ...context.room, ...event.payload } as Room };
            }),

            setMatchStarted: assign(({ event }) => {
                if (event.type !== 'MATCH_STARTED') return {};
                return { currentMatchId: event.payload.matchId };
            }),

            resetMatch: assign(() => ({
                currentMatchId: undefined,
                readyByUserId: {}
            })),

            setRoomEnded: assign(({ context }) => ({
                room: { ...context.room, endedAt: new Date() }
            })),

            addMember: assign(({ context, event }) => {
                if (event.type !== 'ADD_MEMBER') return {};
                return {
                    room: {
                        ...context.room,
                        connectedUserIds: {
                            ...context.room.connectedUserIds,
                            [event.userId]: event.role
                        }
                    },
                    readyByUserId: {
                        ...context.readyByUserId,
                        [event.userId]: false
                    }
                };
            }),

            rejectStart: assign(() => ({
                acceptingPlayers: false
            })),

            removeMember: assign(({ context, event }) => {
                if (event.type !== 'REMOVE_MEMBER') return {};
                const next = { ...context.room.connectedUserIds };
                delete next[event.userId];
                const nextReady = { ...context.readyByUserId };
                delete nextReady[event.userId];
                return {
                    room: {
                        ...context.room,
                        connectedUserIds: next
                    },
                    readyByUserId: nextReady
                };
            })
        }
    }).createMachine({
        id: 'RoomMachine',
        type: 'parallel',

        context: ({ input }) => ({
            room: { ...defaultRoom(), ...(input?.room ?? initialRoom ?? {}) } as Room,
            acceptingPlayers: true,
            currentMatchId: undefined,
            readyByUserId: {},
            storytellerMode: 'ai'
        }),

        // Global handlers (optional but useful)
        on: {
            ROOM_UPDATED: { actions: 'applyRoomUpdate' },
            MATCH_STARTED: { actions: 'setMatchStarted' },
            MATCH_RESET: { actions: 'resetMatch' },
            MATCH_ENDED: { actions: 'setRoomEnded' },
            ADD_MEMBER: { actions: 'addMember' },
            REMOVE_MEMBER: { actions: 'removeMember' }
        },

        states: {
            roomStatus: {
                initial: 'open',
                states: {
                    open: {
                        on: {
                            CLOSE_ROOM: { target: 'closed' },
                            START_MATCH: [
                                {
                                    target: 'in_game',
                                    guard: stateIn({ readiness: 'all_ready' })
                                },
                                {
                                    // readiness is collecting (or anything else)
                                    actions: 'rejectStart'
                                }
                            ]
                        }
                    },

                    closed: {
                        on: {
                            ARCHIVE_ROOM: { target: 'archived' },
                            OPEN_ROOM: { target: 'open' },
                            START_MATCH: [
                                {
                                    target: 'in_game',
                                    guard: stateIn({ readiness: 'all_ready' })
                                },
                                {
                                    // readiness is collecting (or anything else)
                                    actions: 'rejectStart'
                                }
                            ]
                        }
                    },

                    archived: {
                        type: 'final'
                    },

                    in_game: {
                        invoke: {
                            src: GameMachine,
                            input: ({ context }: { context: RoomContext }): GameMachineInput => {
                                if (context.room.scriptId == null) throw new Error('must have a script assigned');
                                return {
                                    maxPlayers: context.room.maxPlayers,
                                    scriptId: context.room.scriptId,
                                    connectedUserIds: context.room.connectedUserIds,
                                    storytellerMode: context.storytellerMode ?? 'ai'
                                };
                            },
                            onDone: { target: 'closed' }
                        }
                    }
                }
            },

            readiness: {
                initial: 'collecting',
                states: {
                    collecting: {
                        on: {
                            READY_CHANGED: [
                                // If the change makes everyone ready, move to all_ready
                                {
                                    target: 'all_ready',
                                    guard: 'readinessAllReadyAfterChange',
                                    actions: 'changeReady'
                                },
                                // Otherwise just update context
                                { actions: 'changeReady' }
                            ]
                        }
                    },

                    all_ready: {
                        on: {
                            READY_CHANGED: [
                                // If the change makes NOT all ready, drop back to collecting
                                {
                                    target: 'collecting',
                                    guard: 'readinessNotAllReadyAfterChange',
                                    actions: 'changeReady'
                                },
                                { actions: 'changeReady' }
                            ]
                        }
                    }
                }
            }
        }
    });
