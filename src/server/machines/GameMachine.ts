// src/server/machines/GameMachine.ts
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { assign, fromPromise, raise, sendParent, setup } from 'xstate';
import type { ActionArgs } from 'xstate';
import { ScriptModel } from '../../db/models/Script';
import { UserModel } from '../../db/models/User';
import type { GameNomination, GameTaskEntry } from '../../types/game';

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

type NightOrderScriptEntry = {
    id: CharacterRoles;
    order: number;
    reminder: string;
};

type NightOrderEntry = NightOrderScriptEntry & {
    index: number;
};

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

type Nomination = GameNomination;
type HumanOrAi = 'human' | 'ai';
type Phase = 'night' | 'day';

type Seat = {
    id: number;
    userId?: string;
    username: string;
    type: HumanOrAi;
    personality?: Personality;
};

type TaskEntry = GameTaskEntry;
type RoleCategory = 'demon' | 'minion' | 'outsider' | 'townsfolk';
type ExtraPopulation = Record<RoleCategory, number>;
type AvailableRoles = Record<RoleCategory, RolesDefined[]>;

export type GameMachineWsEvent =
    | { type: 'dawnBreak'; requireConfirm: boolean }
    | { type: 'deathsRevealed'; payload: number[] }
    | { type: 'requestStatement'; payload: number }
    | { type: 'statementBroadcast'; payload: { statement: string; nomination: Nomination } }
    | { type: 'voteStarted'; payload: Nomination }
    | { type: 'nominationRejected'; payload: Nomination }
    | { type: 'gong' }
    | { type: 'taskStarted'; payload: TaskEntry };

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
const uniqueNamePool = () => shuffle([...AI_NAMES]);
const popName = (pool: string[]) => pool.pop() ?? `AI-${Math.floor(Math.random() * 9_999)}`;
const randomPersonality = (): Personality => ({
    trustModel: randomChoice(['all_trusting', 'cautiously_trusting', 'skeptical', 'guarded', 'doubting_thomas']),
    tableImpact: randomChoice(['disruptive', 'provocative', 'stabilizing', 'organized', 'procedural']),
    reasoningMode: randomChoice(['deductive', 'systematic', 'associative', 'intuitive', 'surface']),
    informationHandling: randomChoice(['archivist', 'curator', 'impressionistic', 'triage', 'signal_driven']),
    voiceStyle: randomChoice(['quiet', 'reserved', 'conversational', 'assertive', 'dominant'])
});

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
    maxPlayers: number;
    connectedUserIds: Record<string, GameRoles>;
    storytellerMode: StorytellerMode;
    scriptId: string;
    deps?: GameMachineInput['deps'];
    setupArgs: GameMachineInput;
    availableTravellers?: RolesDefined[];
    initialPopulation?: SetupPopulations;
    modifiedPopulation?: SetupPopulations & { extra: ExtraPopulation };
    availableRoles?: AvailableRoles;
    bag?: RolesDefined[];
    firstNightOrderFromScript: NightOrderScriptEntry[];
    otherNightOrderFromScript: NightOrderScriptEntry[];
    firstNightOrder: NightOrderEntry[];
    otherNightOrder: NightOrderEntry[];
};

type GameEvents =
    // setup
    | { type: 'SETUP_COMPLETE'; payload: Partial<GameContext> }
    | { type: 'END_GAME' }
    | { type: 'END_REVEAL' }
    | { type: 'EXECUTION' }
    | { type: 'CONFIRM_READY'; userId: string }
    | { type: 'OVERRIDE_WAIT' }
    // in_game
    | { type: 'TIMER_STARTED'; payload: number } // minutes
    | { type: 'TIMER_EXPIRED' }
    | { type: 'GONG' }
    // nominations
    | { type: 'NOMINATION'; payload: Nomination }
    | { type: 'REQUEST_STATEMENT'; payload: number }
    | { type: 'STATEMENT_RECEIVED'; payload: string }
    | { type: 'NEXT_STATEMENT' }
    | { type: 'VOTE_COMPLETE'; payload: VoteComplete }
    // tasks
    | { type: 'ADD_TASK'; payload: TaskEntry }
    | { type: 'COMPLETE_TASK' }
    | { type: 'PAUSE_TASKS' }
    | { type: 'RESUME_TASKS' }
    | { type: 'START_TASKS' }
    // mystery
    | { type: 'ACCUSATION_COMPLETE' }
    | { type: 'END_NIGHT_PHASE' };

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
    setupArgs: input,
    firstNightOrderFromScript: [],
    otherNightOrderFromScript: [],
    firstNightOrder: [],
    otherNightOrder: []
});

const assignGame = assign<GameContext, GameEvents, undefined, GameEvents, never>;

const gameSetupActor = fromPromise<Partial<GameContext>, GameMachineInput, GameEvents>(async ({ input, emit }) => {
    const { maxPlayers, connectedUserIds, storytellerMode, scriptId } = input;
    if (storytellerMode === 'human') {
        throw new Error('unsupported at this time');
    }
    if (maxPlayers < 5 || maxPlayers > 15) {
        throw new Error('maxPlayers out of range');
    }

    const humanEntries = Object.entries(connectedUserIds).filter(([, role]) => role === 'player');
    const humankind = await Promise.all(
        humanEntries.map(async ([userId]) => {
            const user = await UserModel.findById(userId).lean();
            return {
                userId,
                type: 'human' as const,
                username: user?.username ?? `Player-${userId.slice(-4)}`
            };
        })
    );

    const aiPlayers = Math.max(0, maxPlayers - humankind.length);
    const namePool = uniqueNamePool();
    const aiSeats: Omit<Seat, 'id'>[] = [];
    for (let i = 0; i < aiPlayers; i += 1) {
        aiSeats.push({
            type: 'ai',
            username: popName(namePool),
            personality: randomPersonality()
        });
    }

    const shuffledSeats = shuffle([...humankind, ...aiSeats]);
    const seats = shuffledSeats.reduce<Record<number, Seat>>(
        (acc, seat, index) => {
            acc[index + 1] = { ...seat, id: index + 1 };
            return acc;
        },
        {} as Record<number, Seat>
    );

    const script = await ScriptModel.findById(scriptId).lean();
    if (!script) {
        throw new Error('script not found');
    }

    const rolesPayload = (await readFile(rolesFilePath, 'utf8')) as string;
    const populationsData = (await readFile(populationsFilePath, 'utf8')) as string;
    const rolesList = JSON.parse(rolesPayload) as RolesDefinition[];
    const populationList = JSON.parse(populationsData) as SetupPopulations[];

    const normalizedRoles: RolesDefined[] = rolesList.map(({ team, ...rest }) => ({
        ...rest,
        characterType: team
    }));

    const scriptRoles = script.roles.map((roleId) => {
        const match = normalizedRoles.find((role) => role.id === roleId);
        if (!match) {
            throw new Error(`role ${roleId} missing from definitions`);
        }
        return match;
    });

    const firstNightOrderFromScript: NightOrderScriptEntry[] = [...scriptRoles]
        .sort((a, b) => a.firstNight - b.firstNight)
        .map((role) => ({
            id: role.id as CharacterRoles,
            order: role.firstNight,
            reminder: role.firstNightReminder
        }));

    const otherNightOrderFromScript: NightOrderScriptEntry[] = [...scriptRoles]
        .sort((a, b) => a.otherNight - b.otherNight)
        .map((role) => ({
            id: role.id as CharacterRoles,
            order: role.otherNight,
            reminder: role.otherNightReminder
        }));

    const availableTravellers = scriptRoles.filter((role) => role.characterType === 'traveller');
    const eligibleRoles = scriptRoles.filter((role) => ROLE_CATEGORIES.includes(role.characterType as RoleCategory));

    const availableRoles: AvailableRoles = {
        demon: shuffle(eligibleRoles.filter((role) => role.characterType === 'demon')),
        minion: shuffle(eligibleRoles.filter((role) => role.characterType === 'minion')),
        outsider: shuffle(eligibleRoles.filter((role) => role.characterType === 'outsider')),
        townsfolk: shuffle(eligibleRoles.filter((role) => role.characterType === 'townsfolk'))
    };

    const initialPopulation = populationList[maxPlayers - 5];
    if (!initialPopulation) {
        throw new Error('missing population data for player count');
    }

    const modifiedPopulation: SetupPopulations & { extra: ExtraPopulation } = {
        ...initialPopulation,
        extra: { demon: 0, minion: 0, outsider: 0, townsfolk: 0 }
    };

    const pendingTasks: TaskEntry[] = [['demon_bluffs', undefined]];
    const bag: RolesDefined[] = [];

    const modifySetup = (token: RolesDefined) => {
        if (!token.setup) return;
        if (token.id === 'baron') {
            const maxOutsider = availableRoles.outsider.length;
            const newOutsider = modifiedPopulation.outsider + 2;
            let delta = newOutsider <= maxOutsider ? 2 : 2 - (newOutsider - maxOutsider);
            if (delta <= 0) delta = 0;
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
            throw new Error(`not enough ${category} roles for population`);
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
        bag: randomizedBag,
        firstNightOrderFromScript,
        otherNightOrderFromScript,
        firstNightOrder: [],
        otherNightOrder: []
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
        setSetupResults: assign(({ event }) => {
            const data = (event as any).output as Partial<GameContext>;
            return data;
        }),
        applySetupResult: assignGame(({ event }) => {
            if (event.type !== 'SETUP_COMPLETE') return {};
            return { ...event.payload };
        }),
        addTask: assignGame(({ context, event }) => {
            if (event.type !== 'ADD_TASK') return {};
            return {
                tasks: [...context.tasks, event.payload],
                pendingTasks: [...context.pendingTasks, event.payload]
            };
        }),
        clearCurrentTask: assignGame(() => ({ currentTask: undefined })),
        runNextTask: assignGame(({ context }) => {
            if (context.currentTask || context.tasks.length === 0) return {};
            const [next, ...rest] = context.tasks;
            context.deps?.wsEmit?.({ type: 'taskStarted', payload: next });
            return {
                tasks: rest,
                currentTask: next
            };
        }),
        scheduleTimer: ({ event, self }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            if (event.type !== 'TIMER_STARTED') return;
            const timerId = setTimeout(() => {
                self.send({ type: 'TIMER_EXPIRED' });
            }, event.payload * 60_000);
            return () => clearTimeout(timerId);
        },
        emitGong: sendParent(() => ({ type: 'GONG' })),
        broadcastGong: ({ context }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            context.deps?.wsEmit?.({ type: 'gong' });
        },
        startPrivateTimer: sendParent(() => ({ type: 'TIMER_STARTED', payload: 7 })),
        startPublicTimer: sendParent(() => ({ type: 'TIMER_STARTED', payload: 2 })),
        handleRequestStatement: ({ context, event }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            if (event.type !== 'REQUEST_STATEMENT') return;
            context.deps?.wsEmit?.({ type: 'requestStatement', payload: event.payload });
        },
        broadcastStatement: ({ context, event }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            if (event.type !== 'STATEMENT_RECEIVED' || !context.nomination) return;
            context.deps?.wsEmit?.({
                type: 'statementBroadcast',
                payload: {
                    statement: event.payload,
                    nomination: context.nomination
                }
            });
        },
        emitNextStatement: sendParent(() => ({ type: 'NEXT_STATEMENT' })),
        runVote: ({ context }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            if (!context.nomination) return;
            context.deps?.wsEmit?.({ type: 'voteStarted', payload: context.nomination });
        },
        resolveVote: assignGame(({ context, event }) => {
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
        openNominations: assignGame(() => ({ nominationsOpen: true })),
        closeNominations: assignGame(() => ({ nominationsOpen: false })),
        setNomination: assignGame(({ context, event }) => {
            if (event.type !== 'NOMINATION') return {};
            return {
                nomination: event.payload,
                canNominate: context.canNominate.filter((id) => id !== event.payload.nominator),
                canBeNominated: context.canBeNominated.filter((id) => id !== event.payload.nominee)
            };
        }),
        rejectNomination: ({ context, event }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            if (event.type !== 'NOMINATION') return;
            context.deps?.wsEmit?.({ type: 'nominationRejected', payload: event.payload });
        },
        setDawnWaiting: assignGame(({ context }) => ({
            waitingFor: Object.values(context.seats)
                .filter((seat) => seat.type === 'human' && seat.userId)
                .map((seat) => seat.userId!)
        })),
        confirmReady: assignGame(({ context, event }) => {
            if (event.type !== 'CONFIRM_READY') return {};
            return { waitingFor: context.waitingFor.filter((userId) => userId !== event.userId) };
        }),
        clearWaitingFor: assignGame(() => ({ waitingFor: [] })),
        announceDawnWaiting: ({ context }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            context.deps?.wsEmit?.({ type: 'dawnBreak', requireConfirm: true });
        },
        announceDawn: ({ context }: ActionArgs<GameContext, GameEvents, GameEvents>) => {
            context.deps?.wsEmit?.({ type: 'dawnBreak', requireConfirm: false });
        },
        dayReset: assignGame(({ context }) => {
            const survivors = context.alivePlayers.filter((id) => !context.pendingDeaths.includes(id));
            return {
                dailyVotingHistory: [],
                canBeNominated: survivors,
                canNominate: survivors,
                nominationsOpen: false,
                phase: 'day'
            };
        }),
        announceDeaths: assignGame(({ context }) => {
            if (context.pendingDeaths.length) {
                context.deps?.wsEmit?.({ type: 'deathsRevealed', payload: context.pendingDeaths });
            }
            return {
                alivePlayers: context.alivePlayers.filter((id) => !context.pendingDeaths.includes(id)),
                pendingDeaths: [],
                waitingFor: []
            };
        }),
        setPhaseNight: assignGame(() => ({ phase: 'night' })),
        processExecution: assignGame(({ context }) => {
            const removals =
                context.toBeExecuted?.length ? context.toBeExecuted
                : context.markedForExecution ? [context.markedForExecution.nominee]
                : [];
            if (removals.length === 0) return {};
            return {
                alivePlayers: context.alivePlayers.filter((id) => !removals.includes(id)),
                pendingDeaths: removals,
                toBeExecuted: undefined,
                markedForExecution:
                    context.markedForExecution && removals.includes(context.markedForExecution.nominee) ?
                        undefined
                    :   context.markedForExecution
            };
        }),
        refreshNightOrders: assignGame(({ context }) => {
            const aliveRoleSet = new Set<CharacterRoles>();
            context.alivePlayers.forEach((playerId) => {
                const token = context.tokens[playerId];
                if (token) {
                    aliveRoleSet.add(token.id as CharacterRoles);
                }
            });
            const firstNightOrder = context.firstNightOrderFromScript
                .filter((entry) => aliveRoleSet.has(entry.id))
                .map((entry, index) => ({ ...entry, index: index + 1 }));
            const otherNightOrder = context.otherNightOrderFromScript
                .filter((entry) => aliveRoleSet.has(entry.id))
                .map((entry, index) => ({ ...entry, index: index + 1 }));
            return {
                firstNightOrder,
                otherNightOrder
            };
        })
    },
    guards: {
        hasPendingTasks: ({ context }) => context.tasks.length > 0,
        hasCurrentTask: ({ context }) => Boolean(context.currentTask),
        waitingIsEmpty: ({ context }) => context.waitingFor.length === 0,
        isValidNomination: ({ context, event }) => {
            if (event.type !== 'NOMINATION') return false;
            return (
                context.canNominate.includes(event.payload.nominator) &&
                context.canBeNominated.includes(event.payload.nominee)
            );
        }
    }
});

export const GameMachine = builder.createMachine({
    id: 'GameMachine',
    type: 'parallel',
    context: ({ input }) => createInitialContext({ input }),
    states: {
        gameStatus: {
            initial: 'setup',
            states: {
                setup: {
                    invoke: {
                        id: 'setupStart',
                        src: 'onSetupStart',
                        input: ({ context }) => context.setupArgs
                    },
                    on: {
                        'xstate.done.actor.setupStart': {
                            actions: ['setSetupResults', raise({ type: 'SETUP_COMPLETE' })]
                        },
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
                                    entry: 'refreshNightOrders',
                                    on: {
                                        END_NIGHT_PHASE: '../../day'
                                    }
                                },
                                other_night: {
                                    entry: 'refreshNightOrders',
                                    on: {
                                        END_NIGHT_PHASE: '../../day'
                                    }
                                }
                            }
                        },
                        day: {
                            initial: 'dawn',
                            states: {
                                dawn: {
                                    initial: 'idle',
                                    states: {
                                        idle: {
                                            entry: ['announceDawnWaiting', 'setDawnWaiting'],
                                            always: {
                                                target: 'waiting'
                                            }
                                        },
                                        waiting: {
                                            on: {
                                                CONFIRM_READY: [
                                                    {
                                                        target: 'done',
                                                        guard: 'waitingIsEmpty',
                                                        actions: 'confirmReady'
                                                    },
                                                    {
                                                        target: 'waiting',
                                                        actions: 'confirmReady'
                                                    }
                                                ],
                                                OVERRIDE_WAIT: {
                                                    actions: 'clearWaitingFor',
                                                    target: 'done'
                                                }
                                            },
                                            always: {
                                                target: 'running',
                                                guard: 'waitingIsEmpty'
                                            }
                                        },
                                        done: {
                                            entry: ['announceDawn', 'clearWaitingFor'],
                                            always: {
                                                target: '#GameMachine.gameStatus.in_progress.day.noon'
                                            }
                                        }
                                    }
                                },
                                noon: {
                                    type: 'parallel',
                                    entry: ['dayReset', 'announceDeaths'],
                                    states: {
                                        timer: {
                                            initial: 'idle',
                                            states: {
                                                idle: {
                                                    on: {
                                                        TIMER_STARTED: {
                                                            target: 'running',
                                                            actions: 'scheduleTimer'
                                                        }
                                                    }
                                                },
                                                running: {
                                                    on: {
                                                        TIMER_STARTED: {
                                                            actions: 'scheduleTimer'
                                                        },
                                                        TIMER_EXPIRED: 'expired'
                                                    }
                                                },
                                                expired: {
                                                    entry: ['emitGong', 'broadcastGong'],
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
                                            type: 'parallel',
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
                                                                        guard: 'isValidNomination',
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
                                                                            entry: sendParent(({ context }) => {
                                                                                if (!context.nomination)
                                                                                    return { type: 'NEXT_STATEMENT' };
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
                                                                            entry: sendParent(({ context }) => {
                                                                                if (!context.nomination)
                                                                                    return { type: 'NEXT_STATEMENT' };
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
                                                                            always: 'open'
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
                PAUSE_TASKS: '#GameMachine.taskQueue.paused'
            },
            states: {
                paused: {
                    on: {
                        START_TASKS: [
                            {
                                guard: 'hasCurrentTask',
                                target: 'waiting'
                            },
                            {
                                guard: 'hasPendingTasks',
                                target: 'running'
                            },
                            {
                                target: 'empty'
                            }
                        ],
                        COMPLETE_TASK: {
                            actions: 'clearCurrentTask',
                            target: 'paused'
                        },
                        ADD_TASK: {
                            actions: 'addTask'
                        }
                    }
                },
                running: {
                    entry: 'runNextTask',
                    always: [
                        {
                            guard: 'hasCurrentTask',
                            target: 'waiting'
                        },
                        {
                            target: 'empty'
                        }
                    ],
                    on: {
                        ADD_TASK: {
                            actions: 'addTask'
                        }
                    }
                },
                waiting: {
                    on: {
                        COMPLETE_TASK: [
                            {
                                guard: 'hasPendingTasks',
                                target: 'running',
                                actions: 'clearCurrentTask'
                            },
                            {
                                target: 'empty',
                                actions: 'clearCurrentTask'
                            }
                        ],
                        ADD_TASK: {
                            actions: 'addTask'
                        }
                    }
                },
                empty: {
                    on: {
                        START_TASKS: [
                            {
                                guard: 'hasPendingTasks',
                                target: 'running'
                            }
                        ],
                        COMPLETE_TASK: [
                            {
                                guard: 'hasPendingTasks',
                                target: 'running',
                                actions: 'clearCurrentTask'
                            },
                            {
                                target: 'empty',
                                actions: 'clearCurrentTask'
                            }
                        ],
                        ADD_TASK: {
                            actions: 'addTask',
                            target: 'running'
                        }
                    }
                }
            }
        }
    }
});

export type { GameEvents, GameMachineInput };
