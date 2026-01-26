// src/client/state/realtimeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SessionSnapshotContext, SessionStateValue } from '@/shared/realtime/messages';

export type RealtimeStatus = 'disconnected' | 'connecting' | 'connected';

export type SessionSnapshot = {
    value: SessionStateValue;
    context: SessionSnapshotContext;
};

export type RealtimeState = {
    status: RealtimeStatus;
    rooms: RoomSummary[];
    currentRoomId?: string;
    snapshotsByRoomId: Record<string, RoomSnapshotPayload>;
    session?: SessionSnapshot;
    isRoomHost: boolean;
    lastError?: string;
};

const initialState: RealtimeState = {
    status: 'disconnected',
    rooms: [],
    currentRoomId: undefined,
    snapshotsByRoomId: {},
    session: undefined,
    isRoomHost: false,
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
        setSessionSnapshot(state, action: PayloadAction<SessionSnapshot>) {
            state.session = action.payload;
            state.currentRoomId = action.payload.context.currentRoomId;
            state.isRoomHost = action.payload.context.isRoomHost;
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
        selectUsername: (state: RealtimeState) => state.session?.context.username,
        selectUserId: (state: RealtimeState) => state.session?.context.userId,
        selectIsAuth: (state: RealtimeState) => state.session?.value !== 'unauthenticated',
        selectRoomsList: (state: RealtimeState) => state.rooms,
        selectCurrentRoomId: (state: RealtimeState) => state.currentRoomId,
        selectSnapshot: (state: RealtimeState) => (roomId: string) => state.snapshotsByRoomId[roomId],
        selectLastError: (state: RealtimeState) => state.lastError
    }
});

export const realtimeActions = realtimeSlice.actions;
export const realtimeSelectors = realtimeSlice.selectors;

export default realtimeSlice.reducer;
