// src/client/state/useRealtimeRooms.ts
import { useAppSelector } from './hooks';
import { realtimeSelectors } from './realtimeSlice';
import { authSelectors } from './authSlice';

export function useRealtimeRooms() {
    return useAppSelector(realtimeSelectors.selectRoomsList);
}

export function useRealtimeRoom() {
    const rooms = useAppSelector(realtimeSelectors.selectRoomsList);
    const userId = useAppSelector(authSelectors.selectUserId);
    const currentRoom = rooms.find(
        (room) => userId != null && (room.hostUserId === userId || Object.keys(room.connectedUserIds).includes(userId))
    );
}
