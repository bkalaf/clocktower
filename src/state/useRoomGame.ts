// src/state/useRoomGame.ts
import { useEffect, useState } from 'react';
import { useSelector, useActorRef } from '@xstate/react';
import { machine as roomMachine, type RoomContext } from '@/machines/RoomMachine';
import { machine as matchMachine, type MatchContext } from '@/machines/MatchMachine';
import { fetchCurrentMatch, fetchRoom } from '@/client/api/rooms';

type UseRoomGameResult = {
    roomState: RoomContext;
    matchState: MatchContext;
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

export function useRoomGame(roomId?: string): UseRoomGameResult {
    const roomService = useActorRef(roomMachine);
    const matchService = useActorRef(matchMachine);
    const roomState = useSelector(roomService, (state) => state.context);
    const matchState = useSelector(matchService, (state) => state.context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roomId) {
            setLoading(true);
            setError(null);
            matchService.send({ type: 'MATCH_RESET' });
            roomService.send({ type: 'MATCH_ENDED' });
            return;
        }

        let active = true;
        setLoading(true);
        setError(null);
        matchService.send({ type: 'MATCH_RESET' });
        roomService.send({ type: 'MATCH_ENDED' });

        const load = async () => {
            try {
                const data = await fetchRoom(roomId);
                if (!active) return;
                roomService.send({ type: 'ROOM_UPDATED', payload: data });
                if (data.room.status === 'in_match') {
                    try {
                        const match = await fetchCurrentMatch(roomId);
                        if (!active) return;
                        matchService.send({ type: 'MATCH_DATA_LOADED', payload: match });
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
    }, [roomId, roomService, matchService]);

    useEffect(() => {
        if (!roomId || typeof window === 'undefined') return;
        const socket = new WebSocket(getRealtimeUrl());
        let active = true;

        const refreshMatch = async () => {
            try {
                const match = await fetchCurrentMatch(roomId);
                if (!active) return;
                matchService.send({ type: 'MATCH_DATA_LOADED', payload: match });
                roomService.send({ type: 'MATCH_STARTED', payload: { matchId: match._id } });
            } catch (err) {
                console.error('Unable to refresh match data', err);
            }
        };

        type TopicMessage = {
            t?: string;
            payload?: {
                kind?: string;
                type?: string;
                payload?: unknown;
            };
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
            const payload = message.payload;
            if (!payload || payload.kind !== 'event') return;
            const data = payload.payload;
            switch (payload.type) {
                case 'matchStarted':
                    roomService.send({ type: 'MATCH_STARTED', payload: { matchId: data.matchId } });
                    void refreshMatch();
                    break;
                case 'matchPhaseChanged':
                    matchService.send({ type: 'MATCH_PHASE_CHANGED', payload: data });
                    roomService.send({ type: 'MATCH_PHASE_CHANGED', payload: data });
                    break;
                case 'presenceChanged':
                    roomService.send({ type: 'PRESENCE_CHANGED', payload: data });
                    break;
                case 'memberReadyChanged':
                    roomService.send({
                        type: 'MEMBER_READY_CHANGED',
                        payload: { userId: data.userId, isReady: data.isReady }
                    });
                    roomService.send({ type: 'READY_CHANGED' });
                    break;
                case 'hostChanged':
                    roomService.send({ type: 'HOST_CHANGED', payload: data });
                    break;
                case 'system/hostGraceStarted':
                    roomService.send({ type: 'HOST_GRACE_STARTED', payload: data });
                    break;
                case 'system/hostGraceCanceled':
                    roomService.send({ type: 'HOST_GRACE_CANCELED' });
                    break;
                default:
                    break;
            }
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
        };
    }, [roomId, roomService, matchService]);

    return {
        roomState,
        matchState,
        loading,
        error
    };
}
