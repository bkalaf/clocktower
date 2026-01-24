// src/client/state/realtimeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type RealtimeStatus = 'disconnected' | 'connecting' | 'connected';

export type RealtimeState = {
    status: RealtimeStatus;
    rooms: RoomSummary[];
    currentRoomId?: string;
    snapshotsByRoomId: Record<string, RoomSnapshotPayload>;
    lastError?: string;
};

const initialState: RealtimeState = {
    status: 'disconnected',
    rooms: [],
    currentRoomId: undefined,
    snapshotsByRoomId: {},
    lastError: undefined
};

const realtimeSlice = createSlice({
    name: 'realtime',
    initialState,
    reducers: {
        setStatus(state, action: PayloadAction<RealtimeStatus>) {
            state.status = action.payload;
        },
        setRooms(state, action: PayloadAction<RoomSummary[]>) {
            state.rooms = action.payload;
        },
        upsertRoom(state, action: PayloadAction<RoomSummary>) {
            const updated = action.payload;
            const idx = state.rooms.findIndex((room) => room.roomId === updated.roomId);
            if (idx >= 0) {
                state.rooms[idx] = updated;
            } else {
                state.rooms.push(updated);
            }
        },
        setCurrentRoomId(state, action: PayloadAction<string | undefined>) {
            state.currentRoomId = action.payload;
        },
        setSnapshot(state, action: PayloadAction<{ roomId: string; snapshot: RoomSnapshotPayload }>) {
            const { roomId, snapshot } = action.payload;
            state.snapshotsByRoomId[roomId] = snapshot;
        },
        setLastError(state, action: PayloadAction<string | undefined>) {
            state.lastError = action.payload;
        }
    },
    selectors: {
        selectRoomsList: (state: RealtimeState) => state.rooms,
        selectCurrentRoomId: (state: RealtimeState) => state.currentRoomId,
        selectSnapshot: (state: RealtimeState) => (roomId: string) => state.snapshotsByRoomId[roomId],
        selectLastError: (state: RealtimeState) => state.lastError
    }
});

export const realtimeActions = realtimeSlice.actions;
export const realtimeSelectors = realtimeSlice.selectors;

export default realtimeSlice.reducer;
