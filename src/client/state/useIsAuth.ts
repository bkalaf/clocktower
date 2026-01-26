// src/client/state/useIsAuth.ts
import { useAppSelector } from './hooks';
import { realtimeSelectors } from './realtimeSlice';

export function useIsAuth() {
    return useAppSelector(realtimeSelectors.selectIsAuth);
}

export function useUserId() {
    return useAppSelector(realtimeSelectors.selectUserId);
}

export function useUsername() {
    return useAppSelector(realtimeSelectors.selectUsername);
}
