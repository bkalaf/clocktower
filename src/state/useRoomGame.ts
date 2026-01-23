// src/state/useRoomGame.ts
import { useEffect, useRef, useState } from 'react';
import { useSelector, useActorRef } from '@xstate/react';
import { machine as roomMachine, type RoomContext } from '@/server/machines/RoomMachine';
import { machine as gameMachine, type GameContext } from '@/machines/GameMachine';
import { RoomPayload, fetchCurrentMatch, fetchRoom } from '@/client/api/rooms';
import type { Room } from '@/types/room';
import type { GameRoles, SnapshotMsg } from '@/types/game';
import type { MatchPhase, MatchSubphase } from '@/types/match';
import { $keys } from '@/keys';

type UseRoomGameResult = {
    roomState: RoomContext;
    gameState: GameContext;
    loading: boolean;
    error: string | null;
};

function getRealtimeUrl() {
    if (typeof window === 'undefined') {
        return '';
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = import.meta.env.VITE_REALTIME_HOST ?? window.location.hostname;
    const port = import.meta.env.VITE_REALTIME_PORT ?? window.location.port;
    const portSegment = port ? `:${port}` : '';
    return `${protocol}://${host}${portSegment}/ws`;
}

type MatchPhaseSummary = {
    matchId: string;
    phase: MatchPhase;
    subphase: MatchSubphase;
    dayNumber?: number;
    nominationsOpen?: boolean;
    breakoutWhispersEnabled?: boolean;
};

type MatchStartedPayload = { matchId: string };
type MemberReadyPayload = { userId: string; isReady: boolean };
type PresencePayload = {
    connectedUserIds: string[];
    userId: string;
    status: 'connected' | 'disconnected';
};
type HostChangedPayload = { hostUserId: string };
type HostGracePayload = { hostUserId: string; untilTs: number };
type RoomEventType =
    | 'matchStarted'
    | 'matchPhaseChanged'
    | 'presenceChanged'
    | 'memberReadyChanged'
    | 'hostChanged'
    | 'system/hostGraceStarted'
    | 'system/hostGraceCanceled';
type RoomEventPayload = { kind: 'event'; type: RoomEventType; payload?: unknown };
type TopicPayload = RoomEventPayload | SnapshotMsg;

function isMatchStartedPayload(value: unknown): value is MatchStartedPayload {
    return (
        typeof value === 'object' && value !== null && typeof (value as Record<string, unknown>).matchId === 'string'
    );
}

function isMatchPhaseSummary(value: unknown): value is MatchPhaseSummary {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return (
        typeof candidate.matchId === 'string' &&
        typeof candidate.phase === 'string' &&
        typeof candidate.subphase === 'string' &&
        (candidate.dayNumber === undefined || typeof candidate.dayNumber === 'number') &&
        (candidate.nominationsOpen === undefined || typeof candidate.nominationsOpen === 'boolean') &&
        (candidate.breakoutWhispersEnabled === undefined || typeof candidate.breakoutWhispersEnabled === 'boolean')
    );
}

function isPresencePayload(value: unknown): value is PresencePayload {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    const connected = candidate.connectedUserIds;
    if (!Array.isArray(connected) || !connected.every((item) => typeof item === 'string')) return false;
    const status = candidate.status;
    return typeof candidate.userId === 'string' && (status === 'connected' || status === 'disconnected');
}

function isMemberReadyPayload(value: unknown): value is MemberReadyPayload {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return typeof candidate.userId === 'string' && typeof candidate.isReady === 'boolean';
}

function isHostChangedPayload(value: unknown): value is HostChangedPayload {
    return (
        typeof value === 'object' && value !== null && typeof (value as Record<string, unknown>).hostUserId === 'string'
    );
}

function isHostGracePayload(value: unknown): value is HostGracePayload {
    if (typeof value !== 'object' || value === null) return false;
    const candidate = value as Record<string, unknown>;
    return typeof candidate.hostUserId === 'string' && typeof candidate.untilTs === 'number';
}

function roomContextToRoom(context: RoomContext): Room {
    return {
        _id: context._id,
        allowTravellers: context.allowTravellers,
        banner: context.banner,
        connectedUserIds: context.connectedUserIds,
        endedAt: context.endedAt,
        hostUserId: context.hostUserId,
        maxPlayers: context.maxPlayers,
        minPlayers: context.minPlayers,
        maxTravellers: context.maxTravellers,
        plannedStartTime: context.plannedStartTime,
        scriptId: context.scriptId,
        skillLevel: context.skillLevel ?? 'intermediate',
        speed: context.speed,
        visibility: context.visibility,
        storytellerUserIds: context.storytellerUserIds
    };
}

export function useRoomGame(roomId?: string): UseRoomGameResult {
    const roomService = useActorRef(roomMachine);
    const gameService = useActorRef(gameMachine);
    const roomState = useSelector(roomService, (state) => state.context);
    const gameState = useSelector(gameService, (state) => state.context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const realtimeStateRef = useRef<{
        socket: WebSocket | null;
        joined: boolean;
        pendingRoom: RoomPayload | null;
        createRoomSent: boolean;
    }>({ socket: null, joined: false, pendingRoom: null, createRoomSent: false });
    const roleRef = useRef<GameRoles | undefined>(undefined);

    const trySendCreateRoom = () => {
        const state = realtimeStateRef.current;
        const socket = state.socket;
        if (!socket || socket.readyState !== WebSocket.OPEN) return;
        if (!state.joined || state.createRoomSent) return;
        const payload = state.pendingRoom;
        if (!payload) return;
        socket.send(JSON.stringify({ type: 'CREATE_ROOM', room: payload.room }));
        state.createRoomSent = true;
    };

    useEffect(() => {
        if (!roomId) {
            setLoading(true);
            setError(null);
            gameService.send({ type: 'MATCH_RESET' });
            roomService.send({ type: 'MATCH_ENDED' });
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);
        gameService.send({ type: 'MATCH_RESET' });
        roomService.send({ type: 'MATCH_ENDED' });

        const load = async () => {
            try {
                const data = await fetchRoom(roomId);
                if (!active) return;
                roomService.send({ type: 'ROOM_UPDATED', payload: data });
                realtimeStateRef.current.pendingRoom = data;
                realtimeStateRef.current.createRoomSent = false;
                trySendCreateRoom();
                if (data.room.status === 'in_match') {
                    try {
                        const match = await fetchCurrentMatch(roomId);
                        if (!active) return;
                        gameService.send({ type: 'MATCH_DATA_LOADED', payload: match });
                        roomService.send({ type: 'MATCH_STARTED', payload: { matchId: match._id } });
                    } catch (matchError) {
                        console.error('Failed to load current match', matchError);
                    }
                } else {
                    roomService.send({ type: 'MATCH_ENDED' });
                }
            } catch (err) {
                if (!active) return;
                const message = err instanceof Error ? err.message : 'Unable to load room';
                setError(message);
            } finally {
                if (!active) return;
                setLoading(false);
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [roomId, roomService, gameService]);

    useEffect(() => {
        if (!roomId || typeof window === 'undefined') return;
        const socket = new WebSocket(getRealtimeUrl());
        const localRealtimeState = realtimeStateRef.current;
        localRealtimeState.socket = socket;
        localRealtimeState.joined = false;
        localRealtimeState.createRoomSent = false;
        let active = true;

        const refreshMatch = async () => {
            try {
                const match = await fetchCurrentMatch(roomId);
                if (!active) return;
                gameService.send({ type: 'MATCH_DATA_LOADED', payload: match });
                roomService.send({ type: 'MATCH_STARTED', payload: { matchId: match._id } });
            } catch (err) {
                console.error('Unable to refresh match data', err);
            }
        };

        type TopicMessage = {
            t?: string;
            topic?: string;
            payload?: TopicPayload;
            you?: {
                role?: GameRoles;
            };
        };

        const handleSnapshotMessage = (snapshotMsg: SnapshotMsg, topic?: string) => {
            if (!roomId) return;
            const isRoomTopic = topic === $keys.roomPublicTopic(roomId) || topic === $keys.roomStTopic(roomId);
            if (!isRoomTopic) {
                return;
            }
            const context = (snapshotMsg.snapshot as { context?: RoomContext })?.context;
            if (!context) return;
            const room = roomContextToRoom(context);
            roomService.send({
                type: 'ROOM_UPDATED',
                payload: {
                    room,
                    memberRole: (roleRef.current ?? 'player') as GameRoles,
                    storytellerCount: context.storytellerCount
                }
            });
        };

        const handleTopicPayload = (payload: TopicPayload | undefined, topic?: string) => {
            if (!payload) return;
            if (payload.kind === 'snapshot') {
                handleSnapshotMessage(payload, topic);
                return;
            }
            const { type, payload: eventPayload } = payload;
            switch (type) {
                case 'matchStarted': {
                    if (isMatchStartedPayload(eventPayload)) {
                        roomService.send({
                            type: 'MATCH_STARTED',
                            payload: { matchId: eventPayload.matchId }
                        });
                        void refreshMatch();
                    }
                    break;
                }
                case 'matchPhaseChanged': {
                    if (isMatchPhaseSummary(eventPayload)) {
                        gameService.send({ type: 'MATCH_PHASE_CHANGED', payload: eventPayload });
                        roomService.send({ type: 'MATCH_PHASE_CHANGED', payload: eventPayload });
                    }
                    break;
                }
                case 'presenceChanged': {
                    if (isPresencePayload(eventPayload)) {
                        roomService.send({ type: 'PRESENCE_CHANGED', payload: eventPayload });
                    }
                    break;
                }
                case 'memberReadyChanged': {
                    if (isMemberReadyPayload(eventPayload)) {
                        roomService.send({
                            type: 'MEMBER_READY_CHANGED',
                            payload: eventPayload
                        });
                        roomService.send({ type: 'READY_CHANGED' });
                    }
                    break;
                }
                case 'hostChanged': {
                    if (isHostChangedPayload(eventPayload)) {
                        roomService.send({ type: 'HOST_CHANGED', payload: eventPayload });
                    }
                    break;
                }
                case 'system/hostGraceStarted': {
                    if (isHostGracePayload(eventPayload)) {
                        roomService.send({ type: 'HOST_GRACE_STARTED', payload: eventPayload });
                    }
                    break;
                }
                case 'system/hostGraceCanceled': {
                    roomService.send({ type: 'HOST_GRACE_CANCELED' });
                    break;
                }
                default:
                    break;
            }
        };

        const handleMessage = (raw: MessageEvent) => {
            if (!active) return;
            let parsed: unknown;
            try {
                parsed = JSON.parse(raw.data);
            } catch {
                return;
            }
            if (!parsed || typeof parsed !== 'object') return;
            const message = parsed as TopicMessage;
            if (message.t === 'joinedGame') {
                roleRef.current = message.you?.role;
                realtimeStateRef.current.joined = true;
                trySendCreateRoom();
                return;
            }
            if (message.t !== 'topicMessage') return;
            handleTopicPayload(message.payload, message.topic);
        };

        socket.addEventListener('open', () => {
            socket.send(JSON.stringify({ t: 'joinGame', gameId: roomId, lastStreamIds: {} }));
        });
        socket.addEventListener('message', handleMessage);
        socket.addEventListener('error', (event) => {
            console.error('Realtime socket error', event);
        });

        return () => {
            active = false;
            socket.close();
            localRealtimeState.socket = null;
            localRealtimeState.joined = false;
            localRealtimeState.createRoomSent = false;
            roleRef.current = undefined;
        };
    }, [roomId, roomService, gameService]);

    return {
        roomState,
        gameState,
        loading,
        error
    };
}
