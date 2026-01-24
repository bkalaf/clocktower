// src/client/state/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// src/client/state/authSlice.ts
export type AuthState = {
    userId?: string;
    username?: string;
};

const initialState: AuthState = {};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserId(state, action) {
            state.userId = action?.payload ?? '';
        },
        setUsername(state, action) {
            state.username = action?.payload ?? '';
        },
        login(state, action: PayloadAction<{ userId?: string; username?: string }>) {
            state.userId = action.payload?.userId;
            state.username = action.payload?.username;
        },
        logout: () => initialState
    },
    selectors: {
        isAuth: (state) => state.userId != null,
        selectUserId: (state) => state.userId,
        selectUsername: (state) => state.username
    }
});

export const authActions = authSlice.actions;
export const authSelectors = authSlice.selectors;
export default authSlice.reducer;
