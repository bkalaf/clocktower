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

export function useUserLevel() {
    return useAppSelector(authSelectors.selectLevel);
}

export function useUserCurrentXP() {
    return useAppSelector(authSelectors.selectCurrentXP);
}

export function useUserRequiredXP() {
    return useAppSelector(authSelectors.selectRequiredXP);
}

export function useUserScopes() {
    return useAppSelector(authSelectors.selectScopes);
}

export function useHasPrivilegedAccess() {
    const scopes = useUserScopes();
    return scopes.includes('admin') || scopes.includes('moderator');
}
