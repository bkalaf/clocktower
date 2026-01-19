// src/state/TownSquareContext.tsx
import * as React from 'react';
import rolesJson from '@/assets/data/roles.json';
import fabledJson from '@/assets/data/fabled.json';
import { RoleDefinition } from '@/types/roles';

const DEFAULT_PLAYER_NAMES = ['Harper', 'Cort', 'Selene', 'Morrow', 'Vale', 'Ivy', 'Finn', 'Rook'];
const DEFAULT_ROLE_SEQUENCE = [
    'washerwoman',
    'librarian',
    'chef',
    'investigator',
    'fortuneteller',
    'poisoner',
    'drunk',
    'imp'
];

export type TownSquarePlayer = {
    id: string;
    name: string;
    pronouns?: string;
    role: RoleDefinition;
    reminders: string[];
    isDead: boolean;
    isVoteless: boolean;
    isMarked: boolean;
};

export type SessionState = {
    sessionId: string;
    playerId: string;
    isSpectator: boolean;
    isReconnecting: boolean;
    playerCount: number;
    ping: number;
    claimedSeat: number;
    nomination: [number, number];
    votes: Array<boolean | undefined>;
    lockedVote: number;
    votingSpeed: number;
    isVoteInProgress: boolean;
    voteHistory: Array<{
        timestamp: number;
        nominator: string;
        nominee: string;
        type: 'execution' | 'exile';
        majority: number;
        votes: string[];
    }>;
    markedPlayer: number;
    isRolesDistributed: boolean;
};

export type GrimoireState = {
    zoom: number;
    isNight: boolean;
    isNightOrder: boolean;
    isPublic: boolean;
    background: string;
    isImageOptIn: boolean;
    isMuted: boolean;
};

type PlayersAction =
    | { type: 'add'; name?: string }
    | { type: 'remove'; index: number }
    | { type: 'update'; index: number; changes: Partial<TownSquarePlayer> }
    | { type: 'swap'; from: number; to: number }
    | { type: 'move'; from: number; to: number }
    | { type: 'set'; players: TownSquarePlayer[] }
    | { type: 'reset' }
    | { type: 'randomize' };

type SessionAction =
    | { type: 'setNomination'; nomination: [number, number] }
    | { type: 'setVotes'; votes: Array<boolean | undefined> }
    | { type: 'vote'; index: number; value: boolean }
    | { type: 'resetVotes' }
    | { type: 'lockVote'; value?: number }
    | { type: 'setVoteInProgress'; value: boolean }
    | { type: 'setVotingSpeed'; value: number }
    | { type: 'setMarkedPlayer'; value: number }
    | { type: 'addHistory'; entry: SessionState['voteHistory'][number] }
    | { type: 'setSessionId'; value: string }
    | { type: 'setPlayerId'; value: string }
    | { type: 'toggleSpectator'; value?: boolean }
    | { type: 'setPlayerCount'; value: number };

const rolesById = new Map<string, RoleDefinition>(rolesJson.map((role) => [role.id, role]));
const fabledById = new Map<string, RoleDefinition>(fabledJson.map((role) => [role.id, role]));

const buildRole = (id: string): RoleDefinition => {
    return rolesById.get(id) ?? { id, name: id, team: 'townsfolk' };
};

const createInitialPlayers = (): TownSquarePlayer[] => {
    return DEFAULT_PLAYER_NAMES.map((name, index) => ({
        id: `${name.toLowerCase()}-${index}`,
        name,
        role: buildRole(DEFAULT_ROLE_SEQUENCE[index % DEFAULT_ROLE_SEQUENCE.length]),
        reminders: [],
        isDead: false,
        isVoteless: false,
        isMarked: false
    }));
};

const initialPlayers = createInitialPlayers();

const initialSession: SessionState = {
    sessionId: '',
    playerId: '',
    isSpectator: false,
    isReconnecting: false,
    playerCount: initialPlayers.length,
    ping: 0,
    claimedSeat: -1,
    nomination: [0, 1],
    votes: Array(initialPlayers.length).fill(undefined),
    lockedVote: 0,
    votingSpeed: 3000,
    isVoteInProgress: false,
    voteHistory: [],
    markedPlayer: -1,
    isRolesDistributed: false
};

const initialGrimoire: GrimoireState = {
    zoom: 0,
    isNight: false,
    isNightOrder: true,
    isPublic: true,
    background: '',
    isImageOptIn: false,
    isMuted: false
};

const playersReducer: React.Reducer<TownSquarePlayer[], PlayersAction> = (state, action) => {
    switch (action.type) {
        case 'add': {
            if (state.length >= 20) return state;
            const index = state.length;
            const role = buildRole(DEFAULT_ROLE_SEQUENCE[index % DEFAULT_ROLE_SEQUENCE.length]);
            return [
                ...state,
                {
                    id: `${action.name ?? `player-${index}`}-${Date.now()}`,
                    name: action.name ?? `Player ${index + 1}`,
                    role,
                    reminders: [],
                    isDead: false,
                    isVoteless: false,
                    isMarked: false
                }
            ];
        }
        case 'remove': {
            if (action.index < 0 || action.index >= state.length) return state;
            return state.filter((_, idx) => idx !== action.index);
        }
        case 'update': {
            return state.map((player, idx) => (idx === action.index ? { ...player, ...action.changes } : player));
        }
        case 'swap': {
            const { from, to } = action;
            if (from === to) return state;
            const next = [...state];
            next[from] = state[to];
            next[to] = state[from];
            return next;
        }
        case 'move': {
            const { from, to } = action;
            if (from === to) return state;
            const next = [...state];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        }
        case 'set':
            return [...action.players];
        case 'reset':
            return createInitialPlayers();
        case 'randomize': {
            const randomized = [...state];
            for (let i = randomized.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
            }
            return randomized;
        }
        default:
            return state;
    }
};

const sessionReducer: React.Reducer<SessionState, SessionAction> = (state, action) => {
    switch (action.type) {
        case 'setNomination':
            return { ...state, nomination: action.nomination };
        case 'setVotes':
            return { ...state, votes: [...action.votes] };
        case 'vote': {
            const votes = [...state.votes];
            votes[action.index] = action.value;
            return { ...state, votes };
        }
        case 'resetVotes':
            return { ...state, votes: Array(state.playerCount).fill(undefined) };
        case 'lockVote': {
            const value = action.value ?? state.lockedVote + 1;
            return { ...state, lockedVote: value };
        }
        case 'setVoteInProgress':
            return { ...state, isVoteInProgress: action.value };
        case 'setVotingSpeed':
            return { ...state, votingSpeed: action.value };
        case 'setMarkedPlayer':
            return { ...state, markedPlayer: action.value };
        case 'addHistory':
            return { ...state, voteHistory: [action.entry, ...state.voteHistory] };
        case 'setSessionId':
            return { ...state, sessionId: action.value };
        case 'setPlayerId':
            return { ...state, playerId: action.value };
        case 'toggleSpectator':
            return { ...state, isSpectator: action.value ?? !state.isSpectator };
        case 'setPlayerCount':
            return { ...state, playerCount: action.value };
        default:
            return state;
    }
};

const computeNightOrder = (players: TownSquarePlayer[]) => {
    const firstNightNumbers = new Set<number>();
    const otherNightNumbers = new Set<number>();
    players.forEach((player) => {
        if (player.role.firstNight && player.role.firstNight > 0) {
            firstNightNumbers.add(player.role.firstNight);
        }
        if (player.role.otherNight && player.role.otherNight > 0) {
            otherNightNumbers.add(player.role.otherNight);
        }
    });
    const firstNight = [0, ...Array.from(firstNightNumbers).sort((a, b) => a - b)];
    const otherNight = [0, ...Array.from(otherNightNumbers).sort((a, b) => a - b)];
    const orderMap = new Map<number, { first: number; other: number }>();
    players.forEach((player, index) => {
        const firstIndex = Math.max(firstNight.indexOf(player.role.firstNight ?? 0), 0);
        const otherIndex = Math.max(otherNight.indexOf(player.role.otherNight ?? 0), 0);
        orderMap.set(index, { first: firstIndex, other: otherIndex });
    });
    return orderMap;
};

export type TownSquareContextValue = {
    players: TownSquarePlayer[];
    fabled: RoleDefinition[];
    bluffs: RoleDefinition[];
    session: SessionState;
    grimoire: GrimoireState;
    nightOrder: Map<number, { first: number; other: number }>;
    actions: {
        addPlayer: (name?: string) => void;
        removePlayer: (index: number) => void;
        randomizePlayers: () => void;
        resetPlayers: () => void;
        swapPlayers: (from: number, to: number) => void;
        movePlayer: (from: number, to: number) => void;
        updatePlayer: (index: number, changes: Partial<TownSquarePlayer>) => void;
        setNomination: (nomination: [number, number]) => void;
        vote: (index: number, choice: boolean) => void;
        lockVote: (value?: number) => void;
        setVoteInProgress: (value: boolean) => void;
        setVotingSpeed: (value: number) => void;
        setMarkedPlayer: (index: number) => void;
        toggleSpectator: () => void;
        setSessionId: (value: string) => void;
        setPlayerId: (value: string) => void;
        setBackground: (value: string) => void;
        toggleNightOrder: () => void;
        toggleNight: () => void;
        setZoom: (value: number) => void;
        toggleImageOptIn: () => void;
        addHistory: (entry: SessionState['voteHistory'][number]) => void;
    };
};

const TownSquareContext = React.createContext<TownSquareContextValue | undefined>(undefined);

export function TownSquareProvider({ children }: { children: React.ReactNode }) {
    const [players, dispatchPlayers] = React.useReducer(playersReducer, initialPlayers);
    const [session, dispatchSession] = React.useReducer(sessionReducer, {
        ...initialSession,
        playerCount: initialPlayers.length,
        votes: Array(initialPlayers.length).fill(undefined)
    });
    const [grimoire, setGrimoire] = React.useState<GrimoireState>(initialGrimoire);
    const [bluffs] = React.useState<RoleDefinition[]>([]);
    const [fabled] = React.useState<RoleDefinition[]>(Array.from(fabledById.values()));

    React.useEffect(() => {
        dispatchSession({ type: 'setPlayerCount', value: players.length });
        dispatchSession({ type: 'setVotes', votes: Array(players.length).fill(undefined) });
    }, [players.length]);

    const nightOrder = React.useMemo(() => computeNightOrder(players), [players]);

    const actions = React.useMemo(
        () => ({
            addPlayer: (name?: string) => dispatchPlayers({ type: 'add', name }),
            removePlayer: (index: number) => dispatchPlayers({ type: 'remove', index }),
            randomizePlayers: () => dispatchPlayers({ type: 'randomize' }),
            resetPlayers: () => dispatchPlayers({ type: 'reset' }),
            swapPlayers: (from: number, to: number) => dispatchPlayers({ type: 'swap', from, to }),
            movePlayer: (from: number, to: number) => dispatchPlayers({ type: 'move', from, to }),
            updatePlayer: (index: number, changes: Partial<TownSquarePlayer>) =>
                dispatchPlayers({ type: 'update', index, changes }),
            setNomination: (nomination: [number, number]) => dispatchSession({ type: 'setNomination', nomination }),
            vote: (index: number, choice: boolean) => dispatchSession({ type: 'vote', index, value: choice }),
            lockVote: (value?: number) => dispatchSession({ type: 'lockVote', value }),
            setVoteInProgress: (value: boolean) => dispatchSession({ type: 'setVoteInProgress', value }),
            setVotingSpeed: (value: number) => dispatchSession({ type: 'setVotingSpeed', value }),
            setMarkedPlayer: (value: number) => dispatchSession({ type: 'setMarkedPlayer', value }),
            toggleSpectator: () => dispatchSession({ type: 'toggleSpectator' }),
            setSessionId: (value: string) => dispatchSession({ type: 'setSessionId', value }),
            setPlayerId: (value: string) => dispatchSession({ type: 'setPlayerId', value }),
            setBackground: (value: string) =>
                setGrimoire((prev) => ({
                    ...prev,
                    background: value
                })),
            addHistory: (entry) => dispatchSession({ type: 'addHistory', entry }),
            toggleNightOrder: () =>
                setGrimoire((prev) => ({
                    ...prev,
                    isNightOrder: !prev.isNightOrder
                })),
            toggleNight: () =>
                setGrimoire((prev) => ({
                    ...prev,
                    isNight: !prev.isNight
                })),
            setZoom: (value: number) =>
                setGrimoire((prev) => ({
                    ...prev,
                    zoom: value
                })),
            toggleImageOptIn: () =>
                setGrimoire((prev) => ({
                    ...prev,
                    isImageOptIn: !prev.isImageOptIn
                }))
        }),
        []
    );

    const value = React.useMemo(
        () => ({
            players,
            fabled,
            bluffs,
            session,
            grimoire,
            nightOrder,
            actions
        }),
        [players, fabled, bluffs, session, grimoire, nightOrder, actions]
    );

    return <TownSquareContext.Provider value={value}>{children}</TownSquareContext.Provider>;
}

export function useTownSquare() {
    const context = React.useContext(TownSquareContext);
    if (!context) {
        throw new Error('useTownSquare must be used within a TownSquareProvider');
    }
    return context;
}
