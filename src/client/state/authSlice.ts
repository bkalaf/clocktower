import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUserPayload = {
    userId?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    scopes?: string[];
    level?: number;
    currentXP?: number;
    requiredXP?: number;
};

export type AuthState = AuthUserPayload & {
    scopes: string[];
    level: number;
    currentXP: number;
    requiredXP: number;
};

const initialState: AuthState = {
    userId: undefined,
    username: undefined,
    displayName: undefined,
    avatarUrl: undefined,
    scopes: [],
    level: 0,
    currentXP: 0,
    requiredXP: 0
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUserPayload>) {
            const { userId, username, displayName, avatarUrl, scopes, level, currentXP, requiredXP } =
                action.payload;
            state.userId = userId;
            state.username = username;
            state.displayName = displayName;
            state.avatarUrl = avatarUrl;
            state.scopes = scopes ?? [];
            state.level = level ?? 0;
            state.currentXP = currentXP ?? 0;
            state.requiredXP = requiredXP ?? 0;
        },
        clearUser(state) {
            state.userId = undefined;
            state.username = undefined;
            state.displayName = undefined;
            state.avatarUrl = undefined;
            state.scopes = [];
            state.level = 0;
            state.currentXP = 0;
            state.requiredXP = 0;
        }
    }
});

export const authSelectors = {
    selectIsAuth: (state: AuthState) => Boolean(state.userId),
    selectUserId: (state: AuthState) => state.userId,
    selectUsername: (state: AuthState) => state.username,
    selectDisplayName: (state: AuthState) => state.displayName,
    selectAvatarUrl: (state: AuthState) => state.avatarUrl,
    selectScopes: (state: AuthState) => state.scopes,
    selectLevel: (state: AuthState) => state.level,
    selectCurrentXP: (state: AuthState) => state.currentXP,
    selectRequiredXP: (state: AuthState) => state.requiredXP
};

export const authActions = authSlice.actions;
export default authSlice.reducer;
