// src/machines/GameMachine.ts
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { assign, fromPromise, send, sendParent, setup } from 'xstate';
import { ScriptModel } from '../db/models/Script';
import { UserModel } from '../db/models/User';

type TrustModels = 'all_trusting' | 'cautiously_trusting' | 'skeptical' | 'guarded' | 'doubting_thomas';
type TableImpactStyles = 'disruptive' | 'provocative' | 'stabilizing' | 'organized' | 'procedural';
type ReasoningModes = 'deductive' | 'systematic' | 'associative' | 'intuitive' | 'surface';
type InformationHandlingStyle = 'archivist' | 'curator' | 'impressionistic' | 'triage' | 'signal_driven';
type VoiceStyles = 'quiet' | 'reserved' | 'conversational' | 'assertive' | 'dominant';

type Personality = {
    trustModel: TrustModels;
    tableImpact: TableImpactStyles;
    reasoningMode: ReasoningModes;
    informationHandling: InformationHandlingStyle;
    voiceStyle: VoiceStyles;
};

type GameRoles = 'storyteller' | 'player' | 'spectator';
type StorytellerMode = 'ai' | 'human';

type RolesDefinition = {
    id: string;
    name: string;
    edition: string;
    team: string;
    firstNight: number;
    firstNightReminder: string;
    otherNight: number;
    otherNightReminder: string;
    reminders: string[];
    setup: boolean;
    ability: string;
    remindersGlobal?: string[];
};

type RolesDefined = Omit<RolesDefinition, 'team'> & { characterType: string };

type Hatred = {
    id: string;
    hatred: {
        id: string;
        reason: string;
    }[];
}[];

interface SetupPopulations {
    townsfolk: number;
    outsider: number;
    minion: number;
    demon: number;
}

type VoteSuccess = 'fail' | 'success' | 'tied';
type VoteOutcome = {
    nominator: number;
    nominee: number;
    votes: number[];
    voteCount: number;
    success: VoteSuccess;
};
type VoteComplete = Omit<VoteOutcome, 'success' | 'voteCount'>;
type Nomination = { nominator: number; nominee: number };
type HumanOrAi = 'human' | 'ai';
type Phase = 'night' | 'day';

type Seat = {
    id: number;
    userId?: string;
    username: string;
    type: HumanOrAi;
    personality?: Personality;
};

type TaskEntry = [string, unknown];
type RoleCategory = 'demon' | 'minion' | 'outsider' | 'townsfolk';
type ExtraPopulation = Record<RoleCategory, number>;
type AvailableRoles = Record<RoleCategory, RolesDefined[]>;

type GameMachineInput = {
    maxPlayers: number;
    connectedUserIds: Record<string, GameRoles>;
    storytellerMode: StorytellerMode;
    scriptId: string;
    deps?: {
        wsEmit?: (msg: unknown) => void;
    };
};

type GameContext = {
    seats: Record<number, Seat>;
    tokens: Record<number, RolesDefined>;
    alivePlayers: number[];
    tasks: TaskEntry[];
    currentTask?: TaskEntry;
    pendingDeaths: number[];
    canNominate: number[];
    canBeNominated: number[];
    nomination?: Nomination;
    markedForExecution?: VoteOutcome;
    toBeExecuted?: number[];
    votingHistory: Record<number, VoteOutcome[]>;
    dailyVotingHistory: VoteOutcome[];
    ghostVotes: number[];
    waitingFor: string[];
    day: number;
    phase: Phase;
    nominationsOpen: boolean;
    pendingTasks: TaskEntry[];
    maxPlayers: GameMachineInput['maxPlayers'];
    connectedUserIds: GameMachineInput['connectedUserIds'];
    storytellerMode: GameMachineInput['storytellerMode'];
    scriptId: GameMachineInput['scriptId'];
    deps?: GameMachineInput['deps'];
    availableTravellers?: RolesDefined[];
    initialPopulation?: SetupPopulations;
    modifiedPopulation?: SetupPopulations & { extra: ExtraPopulation };
    availableRoles?: AvailableRoles;
    bag?: RolesDefined[];
    setupArgs: GameMachineInput;
};

type GameEvents =
    | { type: 'SETUP_COMPLETE'; payload: Partial<GameContext> }
    | { type: 'END_GAME' }
    | { type: 'END_REVEAL' }
    | { type: 'EXECUTION' }
    | { type: 'CONFIRM_READY'; payload: string }
    | { type: 'OVERRIDE_WAIT' }
    | { type: 'TIMER_STARTED'; payload: number }
    | { type: 'TIMER_EXPIRED' }
    | { type: 'GONG' }
    | { type: 'NOMINATION'; payload: Nomination }
    | { type: 'REQUEST_STATEMENT'; payload: number }
    | { type: 'STATEMENT_RECEIVED'; payload: string }
    | { type: 'NEXT_STATEMENT' }
    | { type: 'VOTE_COMPLETE'; payload: VoteComplete }
    | { type: 'ADD_TASK'; payload: TaskEntry }
    | { type: 'TASK_COMPLETE' }
    | { type: 'PAUSE_TASKS' }
    | { type: 'RESUME_TASKS' }
    | { type: 'START_TASKS' }
    | { type: 'ACCUSATION_COMPLETE' };

const ROLE_CATEGORIES: RoleCategory[] = ['demon', 'minion', 'outsider', 'townsfolk'];

const AI_NAMES = [
    'Nightshade',
    'Ashen Mira',
    'Rook Ember',
    'Velvet Lantern',
    'Briar Hallow',
    'Marrow',
    'Hollow Finch',
    'Thornwick',
    'Fen Whisper',
    'Cindervale',
    'Nocturne',
    'Grimble',
    'Canvas',
    'Tidecall',
    'Sable',
    'Morrow',
    'Aster Vale',
    'Hawthorn',
    'Crowley',
    'Drift',
    'Quill',
    'Bracken',
    'Corvus',
    'Wilder',
    'Galen',
    'Fable'
];

const TRUST_MODEL_OPTIONS: TrustModels[] = [
    'all_trusting',
    'cautiously_trusting',
    'skeptical',
    'guarded',
    'doubting_thomas'
];
const TABLE_IMPACT_OPTIONS: TableImpactStyles[] = [
    'disruptive',
    'provocative',
    'stabilizing',
    'organized',
    'procedural'
];
const REASONING_OPTIONS: ReasoningModes[] = ['deductive', 'systematic', 'associative', 'intuitive', 'surface'];
const INFORMATION_OPTIONS: InformationHandlingStyle[] = [
    'archivist',
    'curator',
    'impressionistic',
    'triage',
    'signal_driven'
];
const VOICE_OPTIONS: VoiceStyles[] = ['quiet', 'reserved', 'conversational', 'assertive', 'dominant'];

const rolesFilePath = path.join(process.cwd(), 'src', 'assets', 'data', 'roles.json');
const populationsFilePath = path.join(process.cwd(), 'src', 'assets', 'data', 'game.json');

const shuffle = <T>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const randomChoice = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const buildNamePool = () => shuffle([...AI_NAMES]);
const popAiName = (pool: string[]) => pool.pop() ?? `AI-${Math.floor(Math.random() * 9_999)}`;

const randomPersonality = (): Personality => ({
    trustModel: randomChoice(TRUST_MODEL_OPTIONS),
    tableImpact: randomChoice(TABLE_IMPACT_OPTIONS),
    reasoningMode: randomChoice(REASONING_OPTIONS),
    informationHandling: randomChoice(INFORMATION_OPTIONS),
    voiceStyle: randomChoice(VOICE_OPTIONS)
});

const createInitialContext = ({ input }: { input: GameMachineInput }): GameContext => ({
    seats: {},
    tokens: {},
    alivePlayers: [],
    tasks: [],
    pendingDeaths: [],
    canNominate: [],
    canBeNominated: [],
    votingHistory: {},
    dailyVotingHistory: [],
    ghostVotes: [],
    waitingFor: [],
    day: 1,
    phase: 'night',
    nominationsOpen: false,
    pendingTasks: [],
    maxPlayers: input.maxPlayers,
    connectedUserIds: input.connectedUserIds,
    storytellerMode: input.storytellerMode,
    scriptId: input.scriptId,
    deps: input.deps,
    setupArgs: input
});

const gameSetupActor = fromPromise<Partial<GameContext>, GameMachineInput>(async ({ input, emit }) => {
    const { maxPlayers, connectedUserIds, storytellerMode, scriptId } = input;
    if (storytellerMode === 'human') {
        throw new Error('unsupported at this time');
    }
    if (maxPlayers < 5 || maxPlayers > 15) {
        throw new Error('maxPlayers out of range');
    }

    const humanEntries = Object.entries(connectedUserIds).filter(([, role]) => role === 'player');
    const humanSeats = await Promise.all(
        humanEntries.map(async ([userId]) => {
            const user = await UserModel.findById(userId).lean();
            return {
                userId,
                type: 'human' as const,
                username: user?.username ?? `Player-${userId.slice(-4)}`
            };
        })
    );

    const aiPlayers = Math.max(0, maxPlayers - humanSeats.length);
    const aiNames = buildNamePool();
    const aiSeats: Omit<Seat, 'id'>[] = [];
    for (let i = 0; i < aiPlayers; i += 1) {
        aiSeats.push({
            type: 'ai',
            username: popAiName(aiNames),
            personality: randomPersonality()
        });
    }

    const seatCandidates = shuffle([...humanSeats, ...aiSeats]);
    const seats = seatCandidates.reduce<Record<number, Seat>>((acc, seat, index) => {
        acc[index + 1] = { ...seat, id: index + 1 };
        return acc;
    }, {});

    const script = await ScriptModel.findById(scriptId).lean();
    if (!script) {
        throw new Error('script not found');
    }

    const rolesPayload = JSON.parse(await readFile(rolesFilePath, 'utf8')) as RolesDefinition[];
    const populations = JSON.parse(await readFile(populationsFilePath, 'utf8')) as SetupPopulations[];
    const normalizedRoles: RolesDefined[] = rolesPayload.map((definition) => {
        const { team, ...rest } = definition;
        return {
            ...rest,
            characterType: team
        };
    });

    const scriptRoles = script.roles.map((roleId) => {
        const definition = normalizedRoles.find((candidate) => candidate.id === roleId);
        if (!definition) {
            throw new Error(`role ${roleId} missing from definition set`);
        }
        return definition;
    });

    const availableTravellers = scriptRoles.filter((role) => role.characterType === 'traveller');

    const eligibleRoles = scriptRoles.filter((role) => ROLE_CATEGORIES.includes(role.characterType as RoleCategory));
    const availableRoles: AvailableRoles = {
        demon: shuffle(eligibleRoles.filter((role) => role.characterType === 'demon')),
        minion: shuffle(eligibleRoles.filter((role) => role.characterType === 'minion')),
        outsider: shuffle(eligibleRoles.filter((role) => role.characterType === 'outsider')),
        townsfolk: shuffle(eligibleRoles.filter((role) => role.characterType === 'townsfolk'))
    };

    const initialPopulation = populations[maxPlayers - 5];
    if (!initialPopulation) {
        throw new Error('no population data for player count');
    }

    const modifiedPopulation: SetupPopulations & { extra: ExtraPopulation } = {
        townsfolk: initialPopulation.townsfolk,
        outsider: initialPopulation.outsider,
        minion: initialPopulation.minion,
        demon: initialPopulation.demon,
        extra: { demon: 0, minion: 0, outsider: 0, townsfolk: 0 }
    };

    const pendingTasks: TaskEntry[] = [['demon_bluffs', undefined]];
    const bag: RolesDefined[] = [];

    const modifySetup = (token: RolesDefined) => {
        if (!token.setup) return;
        if (token.id === 'baron') {
            const maxOutsider = availableRoles.outsider.length;
            const proposed = modifiedPopulation.outsider + 2;
            const delta = proposed <= maxOutsider ? 2 : Math.max(0, 2 - (proposed - maxOutsider));
            modifiedPopulation.outsider += delta;
            modifiedPopulation.townsfolk = Math.max(0, modifiedPopulation.townsfolk - delta);
        }
        if (token.id === 'drunk') {
            modifiedPopulation.extra.townsfolk += 1;
            pendingTasks.push(['mask_drunk', token]);
        }
        if (token.id === 'fortuneteller') {
            pendingTasks.push(['fortuneteller_redherring', token]);
        }
    };

    const takeRoles = (count: number, category: RoleCategory) => {
        if (count <= 0) return;
        const pool = availableRoles[category];
        if (count > pool.length) {
            throw new Error(`not enough ${category} tokens for population`);
        }
        const tokens = pool.splice(0, count);
        tokens.forEach((token) => {
            bag.push(token);
            modifySetup(token);
        });
    };

    ROLE_CATEGORIES.forEach((category) => takeRoles(modifiedPopulation[category], category));
    ROLE_CATEGORIES.forEach((category) => takeRoles(modifiedPopulation.extra[category], category));

    const randomizedBag = shuffle(bag);
    if (randomizedBag.length !== maxPlayers) {
        throw new Error('bag length mismatch');
    }

    const tokens = Object.fromEntries(randomizedBag.map((token, index) => [index + 1, token] as const)) as Record<
        number,
        RolesDefined
    >;

    const alivePlayers = Object.keys(seats).map((seatId) => Number(seatId));
    const ghostVotes = [...alivePlayers];

    const result: Partial<GameContext> = {
        seats,
        tokens,
        alivePlayers,
        ghostVotes,
        pendingTasks: [...pendingTasks],
        tasks: [...pendingTasks],
        availableTravellers,
        initialPopulation,
        modifiedPopulation,
        availableRoles,
        bag: randomizedBag
    };

    emit({ type: 'SETUP_COMPLETE', payload: result });
    return result;
});

const builder = setup({
    types: {
        context: {} as GameContext,
        events: {} as GameEvents,
        input: {} as GameMachineInput
    },
    actors: {
        onSetupStart: gameSetupActor
    },
    actions: {
        applySetupResult: assign((_, event) => {
            if (event.type !== 'SETUP_COMPLETE') return {};
            return { ...event.payload };
        }),
        addTask: assign((context, event) => {
            if (event.type !== 'ADD_TASK') return {};
            return {
                tasks: [...context.tasks, event.payload],
                pendingTasks: [...context.pendingTasks, event.payload]
            };
        }),
        clearCurrentTask: assign(() => ({ currentTask: undefined })),
        runNextTask: assign((context) => {
            if (context.currentTask || context.tasks.length === 0) {
                return {};
            }
            const [next, ...rest] = context.tasks;
            context.deps?.wsEmit?.({ type: 'TASK_STARTED', payload: next });
            return {
                tasks: rest,
                currentTask: next
            };
        }),
        scheduleTimer: send(() => ({ type: 'TIMER_EXPIRED' }), {
            delay: (_context, event) => (event.type === 'TIMER_STARTED' ? event.payload * 60_000 : 0)
        }),
        emitGong: sendParent(() => ({ type: 'GONG' })),
        startPrivateTimer: sendParent(() => ({ type: 'TIMER_STARTED', payload: 7 })),
        startPublicTimer: sendParent(() => ({ type: 'TIMER_STARTED', payload: 2 })),
        handleRequestStatement: (context, event) => {
            if (event.type !== 'REQUEST_STATEMENT') return;
            context.deps?.wsEmit?.({ type: 'REQUEST_STATEMENT', payload: event.payload });
        },
        broadcastStatement: (context, event) => {
            if (event.type !== 'STATEMENT_RECEIVED' || !context.nomination) return;
            context.deps?.wsEmit?.({
                type: 'STATEMENT_BROADCAST',
                payload: {
                    statement: event.payload,
                    nomination: context.nomination
                }
            });
        },
        emitNextStatement: sendParent(() => ({ type: 'NEXT_STATEMENT' })),
        runVote: (context) => {
            if (!context.nomination) return;
            context.deps?.wsEmit?.({ type: 'VOTE_STARTED', payload: context.nomination });
        },
        resolveVote: assign((context, event) => {
            if (event.type !== 'VOTE_COMPLETE') return {};
            const minimumVoteRequired = Math.ceil(context.alivePlayers.length / 2);
            const toBeat = context.markedForExecution?.voteCount ?? 0;
            const voteCount = event.payload.votes.length;
            const success: VoteSuccess =
                voteCount < minimumVoteRequired ? 'fail'
                : voteCount < toBeat ? 'fail'
                : voteCount === toBeat ? 'tied'
                : 'success';
            const result: VoteOutcome = {
                ...event.payload,
                voteCount,
                success
            };
            const nextDailyHistory = [...context.dailyVotingHistory, result];
            const updatedVotingHistory = {
                ...context.votingHistory,
                [result.nominee]: [...(context.votingHistory[result.nominee] ?? []), result]
            };
            return {
                dailyVotingHistory: nextDailyHistory,
                votingHistory: updatedVotingHistory,
                markedForExecution: result.success === 'success' ? result : context.markedForExecution,
                nomination: undefined
            };
        }),
        emitAccusationComplete: sendParent(() => ({ type: 'ACCUSATION_COMPLETE' })),
        openNominations: assign(() => ({ nominationsOpen: true })),
        closeNominations: assign(() => ({ nominationsOpen: false })),
        setNomination: assign((context, event) => {
            if (event.type !== 'NOMINATION') return {};
            return {
                nomination: event.payload,
                canNominate: context.canNominate.filter((id) => id !== event.payload.nominator),
                canBeNominated: context.canBeNominated.filter((id) => id !== event.payload.nominee)
            };
        }),
        rejectNomination: (context, event) => {
            if (event.type !== 'NOMINATION') return;
            context.deps?.wsEmit?.({ type: 'NOMINATION_REJECTED', payload: event.payload });
        },
        setDawnWaiting: assign((context) => ({
            waitingFor: Object.values(context.seats)
                .filter((seat) => seat.type === 'human' && seat.userId)
                .map((seat) => seat.userId!)
        })),
        confirmReady: assign((context, event) => {
            if (event.type !== 'CONFIRM_READY') return {};
            return { waitingFor: context.waitingFor.filter((userId) => userId !== event.payload) };
        }),
        clearWaitingFor: assign(() => ({ waitingFor: [] })),
        announceDawnWaiting: (context) => {
            context.deps?.wsEmit?.({ type: 'SHOW_DAWN_BREAK_DIALOG', requireConfirm: true });
        },
        announceDawnRunning: (context) => {
            context.deps?.wsEmit?.({ type: 'SHOW_DAWN_BREAK_DIALOG', requireConfirm: false });
        },
        dayReset: assign((context) => {
            const survivors = context.alivePlayers.filter((id) => !context.pendingDeaths.includes(id));
            return {
                dailyVotingHistory: [],
                canBeNominated: survivors,
                canNominate: survivors,
                nominationsOpen: false,
                phase: 'day'
            };
        }),
        announceDeaths: assign((context) => {
            const deaths = context.pendingDeaths;
            if (deaths.length) {
                context.deps?.wsEmit?.({ type: 'DEATHS_REVEALED', payload: deaths });
            }
            return {
                alivePlayers: context.alivePlayers.filter((id) => !deaths.includes(id)),
                pendingDeaths: [],
                waitingFor: []
            };
        }),
        setPhaseNight: assign(() => ({ phase: 'night' })),
        processExecution: assign((context) => {
            const removals =
                context.toBeExecuted?.length ? context.toBeExecuted
                : context.markedForExecution ? [context.markedForExecution.nominee]
                : [];
            if (removals.length === 0) {
                return {};
            }
            return {
                alivePlayers: context.alivePlayers.filter((id) => !removals.includes(id)),
                pendingDeaths: removals,
                toBeExecuted: undefined,
                markedForExecution:
                    context.markedForExecution && removals.includes(context.markedForExecution.nominee) ?
                        undefined
                    :   context.markedForExecution
            };
        })
    },
    guards: {
        hasPendingTasks: ({ context }) => context.tasks.length > 0,
        hasCurrentTask: ({ context }) => Boolean(context.currentTask),
        waitingForEmpty: ({ context }) => context.waitingFor.length === 0,
        isValidNomination: ({ context, event }) => {
            if (event.type !== 'NOMINATION') return false;
            const { nominator, nominee } = event.payload;
            return context.canNominate.includes(nominator) && context.canBeNominated.includes(nominee);
        }
    }
});

export const GameMachine = builder.createMachine({
    id: 'GameMachine',
    type: 'parallel',
    predictableActionArguments: true,
    preserveActionOrder: true,
    context: ({ input }) => createInitialContext({ input }),
    states: {
        gameStatus: {
            initial: 'setup',
            states: {
                setup: {
                    invoke: {
                        src: 'onSetupStart'
                    },
                    on: {
                        SETUP_COMPLETE: {
                            target: 'in_progress',
                            actions: 'applySetupResult'
                        }
                    }
                },
                in_progress: {
                    type: 'parallel',
                    on: {
                        END_GAME: '#GameMachine.gameStatus.reveal'
                    },
                    states: {
                        night: {
                            entry: 'setPhaseNight',
                            initial: 'first_night',
                            states: {
                                first_night: {
                                    on: {}
                                },
                                other_night: {}
                            }
                        },
                        day: {
                            initial: 'dawn',
                            states: {
                                dawn: {
                                    initial: 'waiting',
                                    states: {
                                        waiting: {
                                            entry: ['announceDawnWaiting', 'setDawnWaiting'],
                                            on: {
                                                CONFIRM_READY: {
                                                    actions: 'confirmReady'
                                                },
                                                OVERRIDE_WAIT: {
                                                    actions: 'clearWaitingFor',
                                                    target: 'running'
                                                }
                                            },
                                            always: {
                                                target: 'running',
                                                cond: 'waitingForEmpty'
                                            }
                                        },
                                        running: {
                                            entry: ['announceDawnRunning', 'clearWaitingFor'],
                                            always: 'day'
                                        }
                                    }
                                },
                                day: {
                                    type: 'parallel',
                                    entry: ['dayReset', 'announceDeaths'],
                                    states: {
                                        timer: {
                                            initial: 'running',
                                            states: {
                                                running: {
                                                    on: {
                                                        TIMER_STARTED: {
                                                            actions: 'scheduleTimer'
                                                        },
                                                        TIMER_EXPIRED: 'expired'
                                                    }
                                                },
                                                expired: {
                                                    entry: 'emitGong',
                                                    on: {
                                                        TIMER_STARTED: {
                                                            target: 'running',
                                                            actions: 'scheduleTimer'
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        discussion: {
                                            initial: 'pre_nominations',
                                            states: {
                                                pre_nominations: {
                                                    initial: 'private',
                                                    states: {
                                                        private: {
                                                            entry: 'startPrivateTimer',
                                                            on: {
                                                                TIMER_EXPIRED: 'public'
                                                            }
                                                        },
                                                        public: {
                                                            entry: 'startPublicTimer',
                                                            on: {
                                                                TIMER_EXPIRED: '../../nominations.open'
                                                            }
                                                        }
                                                    }
                                                },
                                                nominations: {
                                                    initial: 'open',
                                                    states: {
                                                        open: {
                                                            entry: 'openNominations',
                                                            exit: 'closeNominations',
                                                            on: {
                                                                NOMINATION: [
                                                                    {
                                                                        cond: 'isValidNomination',
                                                                        target: 'accusation',
                                                                        actions: ['setNomination']
                                                                    },
                                                                    {
                                                                        actions: 'rejectNomination'
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        accusation: {
                                                            type: 'parallel',
                                                            on: {
                                                                ACCUSATION_COMPLETE: 'open'
                                                            },
                                                            states: {
                                                                messages: {
                                                                    initial: 'idle',
                                                                    states: {
                                                                        idle: {
                                                                            on: {
                                                                                REQUEST_STATEMENT: {
                                                                                    target: 'waiting',
                                                                                    actions: 'handleRequestStatement'
                                                                                }
                                                                            }
                                                                        },
                                                                        waiting: {
                                                                            on: {
                                                                                STATEMENT_RECEIVED: {
                                                                                    target: 'idle',
                                                                                    actions: [
                                                                                        'broadcastStatement',
                                                                                        'emitNextStatement'
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                parties: {
                                                                    initial: 'accuser',
                                                                    states: {
                                                                        accuser: {
                                                                            entry: sendParent((context) => {
                                                                                if (!context.nomination) {
                                                                                    return { type: 'NEXT_STATEMENT' };
                                                                                }
                                                                                return {
                                                                                    type: 'REQUEST_STATEMENT',
                                                                                    payload:
                                                                                        context.nomination.nominator
                                                                                };
                                                                            }),
                                                                            on: {
                                                                                NEXT_STATEMENT: 'accused'
                                                                            }
                                                                        },
                                                                        accused: {
                                                                            entry: sendParent((context) => {
                                                                                if (!context.nomination) {
                                                                                    return { type: 'NEXT_STATEMENT' };
                                                                                }
                                                                                return {
                                                                                    type: 'REQUEST_STATEMENT',
                                                                                    payload: context.nomination.nominee
                                                                                };
                                                                            }),
                                                                            on: {
                                                                                NEXT_STATEMENT: 'vote_in_progress'
                                                                            }
                                                                        },
                                                                        vote_in_progress: {
                                                                            entry: 'runVote',
                                                                            on: {
                                                                                VOTE_COMPLETE: {
                                                                                    target: 'resolve',
                                                                                    actions: [
                                                                                        'resolveVote',
                                                                                        'emitAccusationComplete'
                                                                                    ]
                                                                                }
                                                                            }
                                                                        },
                                                                        resolve: {
                                                                            on: {}
                                                                        }
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
                                execution: {
                                    entry: ['processExecution']
                                }
                            },
                            on: {
                                EXECUTION: 'execution'
                            }
                        }
                    }
                },
                reveal: {
                    on: {
                        END_REVEAL: 'complete'
                    }
                },
                complete: {
                    type: 'final'
                }
            }
        },
        taskQueue: {
            initial: 'paused',
            on: {
                ADD_TASK: {
                    actions: 'addTask'
                },
                START_TASKS: [
                    {
                        cond: 'hasPendingTasks',
                        target: 'running'
                    },
                    {
                        target: 'empty'
                    }
                ],
                RESUME_TASKS: [
                    {
                        cond: 'hasPendingTasks',
                        target: 'running'
                    },
                    {
                        target: 'empty'
                    }
                ],
                PAUSE_TASKS: 'paused'
            },
            states: {
                paused: {
                    on: {
                        START_TASKS: [
                            {
                                cond: 'hasPendingTasks',
                                target: 'running'
                            }
                        ]
                    }
                },
                running: {
                    entry: 'runNextTask',
                    always: [
                        {
                            cond: 'hasCurrentTask',
                            target: 'waiting'
                        },
                        {
                            target: 'empty'
                        }
                    ]
                },
                waiting: {
                    on: {
                        TASK_COMPLETE: [
                            {
                                cond: 'hasPendingTasks',
                                target: 'running',
                                actions: 'clearCurrentTask'
                            },
                            {
                                target: 'empty',
                                actions: 'clearCurrentTask'
                            }
                        ],
                        PAUSE_TASKS: 'paused'
                    }
                },
                empty: {
                    on: {
                        START_TASKS: [
                            {
                                cond: 'hasPendingTasks',
                                target: 'running'
                            }
                        ]
                    }
                }
            }
        }
    }
});
