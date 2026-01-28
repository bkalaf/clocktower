import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUserPayload = {
    userId?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    scopes?: string[];
};

export type AuthState = AuthUserPayload & {
    scopes: string[];
};

const initialState: AuthState = {
    userId: undefined,
    username: undefined,
    displayName: undefined,
    avatarUrl: undefined,
    scopes: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUserPayload>) {
            const { userId, username, displayName, avatarUrl, scopes } = action.payload;
            state.userId = userId;
            state.username = username;
            state.displayName = displayName;
            state.avatarUrl = avatarUrl;
            state.scopes = scopes ?? [];
        },
        clearUser(state) {
            state.userId = undefined;
            state.username = undefined;
            state.displayName = undefined;
            state.avatarUrl = undefined;
            state.scopes = [];
        }
    }
});

export const authSelectors = {
    selectIsAuth: (state: AuthState) => Boolean(state.userId),
    selectUserId: (state: AuthState) => state.userId,
    selectUsername: (state: AuthState) => state.username,
    selectDisplayName: (state: AuthState) => state.displayName,
    selectAvatarUrl: (state: AuthState) => state.avatarUrl,
    selectScopes: (state: AuthState) => state.scopes
};

export const authActions = authSlice.actions;
export default authSlice.reducer;
