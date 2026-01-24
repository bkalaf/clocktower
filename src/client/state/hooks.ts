// src/client/state/hooks.ts
import { useCallback } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { requestRoomsList, sendCreateRoom } from './wsMiddleware';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useRealtimeState() {
    return useAppSelector((state) => state.realtime);
}

export function useRealtimeStatus() {
    return useAppSelector((state) => state.realtime.status);
}

export function useRealtimeCurrentRoom() {
    const { currentRoomId, snapshotsByRoomId } = useRealtimeState();
    const snapshot = currentRoomId ? snapshotsByRoomId[currentRoomId] : undefined;
    return { roomId: currentRoomId, snapshot };
}

export function useRequestRoomsList() {
    const dispatch = useAppDispatch();
    return useCallback(() => requestRoomsList(dispatch), [dispatch]);
}

export function useCreateRoom() {
    const dispatch = useAppDispatch();
    return useCallback(
        (room: Room) => {
            return sendCreateRoom(dispatch, room);
        },
        [dispatch]
    );
}
