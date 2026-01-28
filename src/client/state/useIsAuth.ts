// src/client/state/useIsAuth.ts
import { useAppSelector } from './hooks';
import { authSelectors } from './authSlice';

export function useIsAuth() {
    return useAppSelector(authSelectors.selectIsAuth);
}

export function useUserId() {
    return useAppSelector(authSelectors.selectUserId);
}

export function useUsername() {
    return useAppSelector(authSelectors.selectUsername);
}

export function useAvatarUrl() {
    return useAppSelector(authSelectors.selectAvatarUrl);
}

export function useDisplayName() {
    return useAppSelector(authSelectors.selectDisplayName);
}
